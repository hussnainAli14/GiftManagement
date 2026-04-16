import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getMessagesWithPeerApi, postMessageApi, type MessageDto } from '../../../api/messageApi';
import { useAuth } from '../../../context/AuthContext';
import { useMessageSocket } from '../../../context/MessageSocketContext';
import type { ChatThreadParams } from '../../../navigation/messagingParams';
import { colors } from '../../../theme';
import { styles } from './styles';
import { getAvatarImageSource } from '../../../utils/resolveUserAvatar';

type ChatRoute = RouteProp<{ ChatThread: ChatThreadParams }, 'ChatThread'>;

function belongsToThread(msg: MessageDto, myId: string, peerId: string): boolean {
  const key = msg.conversationKey;
  if (!key) return false;
  const parts = key.split(':');
  return parts.includes(myId) && parts.includes(peerId);
}

function formatTime(iso: string | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

const ChatThread = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute<ChatRoute>();
  const { peerUserId } = route.params;
  const { user } = useAuth();
  const { socket, connected } = useMessageSocket();
  const myId = user?.id ?? '';
  const listRef = useRef<FlatList<MessageDto>>(null);

  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  /** Android: lift composer above software keyboard (KAV alone is unreliable with native stack). */
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const seenIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const show = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const mergeMessage = useCallback(
    (dto: MessageDto) => {
      if (!belongsToThread(dto, myId, peerUserId)) return;
      if (seenIds.current.has(dto._id)) return;
      seenIds.current.add(dto._id);
      setMessages((prev) => {
        if (prev.some((m) => m._id === dto._id)) return prev;
        const next = [...prev, dto];
        next.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        return next;
      });
    },
    [myId, peerUserId]
  );

  const loadHistory = useCallback(async () => {
    if (!myId) return;
    setLoading(true);
    seenIds.current = new Set();
    try {
      const rows = await getMessagesWithPeerApi(peerUserId);
      rows.forEach((m) => seenIds.current.add(m._id));
      setMessages(rows);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [myId, peerUserId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    if (!socket) return;
    const handler = (dto: MessageDto) => {
      mergeMessage(dto);
    };
    socket.on('new_message', handler);
    return () => {
      socket.off('new_message', handler);
    };
  }, [socket, mergeMessage]);

  useEffect(() => {
    if (messages.length === 0) return;
    const t = setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
    return () => clearTimeout(t);
  }, [messages.length]);

  const send = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending || !myId) return;
    setSending(true);
    setText('');

    const fallbackHttp = async () => {
      const dto = await postMessageApi(peerUserId, trimmed);
      mergeMessage(dto);
    };

    try {
      if (socket && connected) {
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('timeout')), 8000);
          socket.emit('send_message', { peerUserId, text: trimmed }, (ack: unknown) => {
            clearTimeout(timeout);
            const a = ack as { success?: boolean; data?: MessageDto; message?: string };
            if (a?.success && a.data) {
              mergeMessage(a.data);
              resolve();
            } else {
              reject(new Error(a?.message || 'Socket send failed'));
            }
          });
        });
      } else {
        await fallbackHttp();
      }
    } catch {
      try {
        await fallbackHttp();
      } catch {
        setText(trimmed);
      }
    } finally {
      setSending(false);
    }
  };

  const renderBubble = ({ item }: { item: MessageDto }) => {
    const mine = item.senderId === myId;
    const avatarSource = getAvatarImageSource(item.senderAvatar || '', item.senderName || 'User');
    return (
      <View style={[styles.bubbleRow, mine ? styles.bubbleRowMine : styles.bubbleRowTheirs]}>
        {!mine ? <Image source={avatarSource} style={(styles as any).msgAvatar} /> : null}
        <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
          <Text style={mine ? styles.bubbleTextMine : styles.bubbleTextTheirs}>{item.text}</Text>
          <Text style={[styles.time, mine && styles.timeMine]}>{formatTime(item.createdAt)}</Text>
        </View>
        {mine ? <Image source={avatarSource} style={(styles as any).msgAvatar} /> : null}
      </View>
    );
  };

  const inputRowBottomPad =
    Platform.OS === 'android' && keyboardHeight > 0
      ? 10
      : Math.max(insets.bottom, 10);
  const androidKeyboardLift = Platform.OS === 'android' && keyboardHeight > 0 ? keyboardHeight + 12 : 0;

  return (
    <KeyboardAvoidingView
      style={[styles.container]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 92 : 0}
    >
      {!connected ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Live connection unavailable — messages send via network.</Text>
        </View>
      ) : null}
      {loading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          ref={listRef}
          style={styles.list}
          data={messages}
          keyExtractor={(m) => m._id}
          renderItem={renderBubble}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        />
      )}
      <View
        style={[
          styles.inputWrap,
          androidKeyboardLift > 0 ? { paddingBottom: androidKeyboardLift } : null,
        ]}
      >
        <View style={[styles.inputRow, { paddingBottom: inputRowBottomPad }]}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Message…"
            placeholderTextColor={colors.darkGray}
            multiline
            editable={!sending}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!text.trim() || sending) && styles.sendDisabled]}
            onPress={send}
            disabled={!text.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Icon name="send" size={22} color={colors.white} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatThread;

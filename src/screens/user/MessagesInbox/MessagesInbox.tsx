import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getConversationsApi, type ConversationSummary } from '../../../api/messageApi';
import { getAvatarImageSource } from '../../../utils/resolveUserAvatar';
import { colors } from '../../../theme';
import type { ChatThreadParams } from '../../../navigation/messagingParams';
import { useMessageSocket } from '../../../context/MessageSocketContext';
import { styles } from './styles';

type Nav = NativeStackNavigationProp<
  { ChatThread: ChatThreadParams; MessagesInbox: undefined; NewChat: undefined },
  'MessagesInbox'
>;

const MessagesInbox = () => {
  const navigation = useNavigation<Nav>();
  const { connected } = useMessageSocket();
  const [items, setItems] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getConversationsApi();
      setItems(list);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const openThread = (row: ConversationSummary) => {
    navigation.navigate('ChatThread', {
      peerUserId: row.peerUser._id,
      peerName: row.peerUser.name,
      peerAvatar: row.peerUser.avatar,
    });
  };

  const renderItem = ({ item }: { item: ConversationSummary }) => {
    const preview = item.lastMessage?.text ?? 'No messages yet';
    const unread = item.unreadCount > 0;
    const source = getAvatarImageSource(item.peerUser.avatar ?? '', item.peerUser.name);
    return (
      <TouchableOpacity style={styles.row} onPress={() => openThread(item)} activeOpacity={0.7}>
        <Image source={source} style={styles.avatar} />
        <View style={styles.textCol}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {item.peerUser.name}
            </Text>
            {unread ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.unreadCount > 9 ? '9+' : item.unreadCount}</Text>
              </View>
            ) : null}
          </View>
          <Text style={[styles.preview, unread && styles.previewUnread]} numberOfLines={2}>
            {preview}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {!connected && !loading ? (
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <Text style={{ fontSize: 13, color: colors.darkGray }}>Reconnecting to chat…</Text>
        </View>
      ) : null}
      {loading ? (
        <View style={styles.empty}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(row) => row.peerUser._id}
          renderItem={renderItem}
          contentContainerStyle={[styles.listContent, items.length === 0 && { flexGrow: 1 }]}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No conversations yet. Tap + to start a new chat.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default MessagesInbox;

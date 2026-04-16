import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search } from '../../../components';
import { searchUsersApi, type UserSearchResult } from '../../../api/userApi';
import { useAuth } from '../../../context/AuthContext';
import { getAvatarImageSource } from '../../../utils/resolveUserAvatar';
import type { ChatThreadParams } from '../../../navigation/messagingParams';
import { styles } from './styles';

type Nav = NativeStackNavigationProp<
  { NewChat: undefined; ChatThread: ChatThreadParams },
  'NewChat'
>;

const NewChat = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();

  const [q, setQ] = useState('');
  const [rows, setRows] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const doSearch = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const list = await searchUsersApi(trimmed);
      const myId = user?.id;
      setRows(myId ? list.filter((u) => u._id !== myId) : list);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Small debounce so we don't spam the API on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      doSearch(q);
    }, 350);
    return () => clearTimeout(t);
  }, [q, doSearch]);

  const start = (u: UserSearchResult) => {
    navigation.navigate('ChatThread', {
      peerUserId: u._id,
      peerName: u.name || u.email || 'User',
      peerAvatar: u.avatar,
    });
  };

  const renderItem = ({ item }: { item: UserSearchResult }) => {
    const name = item.name || item.email || 'User';
    const email = item.email?.trim();
    const source = getAvatarImageSource(item.avatar ?? '', name);
    return (
      <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => start(item)}>
        <Image source={source} style={styles.avatar} />
        <View style={styles.textCol}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          {email ? <Text style={styles.email} numberOfLines={1}>{email}</Text> : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.searchWrap}>
        <Search
          placeholder="Search users (name / email)"
          value={q}
          onChangeText={setQ}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      {q.trim().length < 2 ? (
        <Text style={styles.hint}>Type at least 2 characters to search.</Text>
      ) : null}

      <FlatList
        data={rows}
        keyExtractor={(u) => u._id}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          !loading && q.trim().length >= 2 ? (
            <Text style={styles.hint}>No users found.</Text>
          ) : null
        }
      />
    </View>
  );
};

export default NewChat;

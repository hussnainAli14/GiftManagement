import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Search, FriendItem, FriendRequestItem } from '../../../components';
import type { Friend } from '../../../components/FriendItem';
import type { FriendRequest } from '../../../components/FriendRequestItem';
import {
  getFriendsApi,
  getPendingFriendRequestsApi,
  acceptFriendRequestApi,
  declineFriendRequestApi,
} from '../../../api/friendApi';
import type { FriendRequestModel } from '../../../api/friendApi';
import { useNotificationBadge } from '../../../context/NotificationBadgeContext';
import { colors } from '../../../theme';
import { styles } from './styles';

type FriendsStackParamList = {
  FriendsMain: undefined;
  AddFriends: undefined;
  Notifications: undefined;
  MessagesInbox: undefined;
  ChatThread: { peerUserId: string; peerName: string; peerAvatar?: string };
  FriendProfile: {
    friendId: string;
    friendName: string;
    friendAvatar: string;
    friendEmail?: string;
  };
};

type FriendsScreenNavigationProp = NativeStackNavigationProp<FriendsStackParamList, 'FriendsMain'>;

function mapIncomingToFriendRequest(request: FriendRequestModel): FriendRequest {
  const requester = request.requester;
  const fullName = requester?.name || 'User';
  const parts = fullName.split(' ');
  return {
    id: request._id,
    firstName: parts[0] || fullName,
    lastName: parts.slice(1).join(' '),
    name: fullName,
    avatar: requester?.avatar ?? '',
    mutualFriendsCount: 0,
    type: 'incoming',
    peerUserId: requester?._id,
    peerEmail: requester?.email,
  };
}

const Friends = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<FriendsScreenNavigationProp>();
  const { unreadCount } = useNotificationBadge();
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);

  const load = useCallback(async () => {
    try {
      const [friendsRes, pending] = await Promise.all([
        getFriendsApi(),
        getPendingFriendRequestsApi(),
      ]);
      setFriends(
        friendsRes.map((entry) => ({
          id: entry.friend._id,
          name: entry.friend.name || 'Friend',
          avatar: entry.friend.avatar ?? '',
          email: entry.friend.email,
        }))
      );
      setIncomingRequests(pending.map(mapIncomingToFriendRequest));
    } catch {
      setFriends([]);
      setIncomingRequests([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleNotificationsPress = () => {
    navigation.navigate('Notifications');
  };

  const handleFriendPress = (friend: Friend) => {
    navigation.navigate('FriendProfile', {
      friendId: friend.id,
      friendName: friend.name,
      friendAvatar: typeof friend.avatar === 'string' ? friend.avatar : '',
      friendEmail: friend.email,
    });
  };

  const handleRequestPress = (request: FriendRequest) => {
    const uid = request.peerUserId;
    if (!uid) return;
    navigation.navigate('FriendProfile', {
      friendId: uid,
      friendName: request.name,
      friendAvatar: typeof request.avatar === 'string' ? request.avatar : '',
      friendEmail: request.peerEmail,
    });
  };

  const handleAccept = async (request: FriendRequest) => {
    await acceptFriendRequestApi(request.id);
    load();
  };

  const handleDecline = async (request: FriendRequest) => {
    await declineFriendRequestApi(request.id);
    load();
  };

  const handleAddFriendPress = () => {
    navigation.navigate('AddFriends');
  };

  const handleMessagesPress = () => {
    navigation.navigate('MessagesInbox');
  };

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFriend = ({ item }: { item: Friend }) => (
    <FriendItem friend={item} onPress={handleFriendPress} />
  );

  const listHeader = (
    <>
      <View style={styles.searchContainer}>
        <Search
          placeholder="Search friends..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {incomingRequests.length > 0 ? (
        <View style={styles.requestsSection}>
          <Text style={styles.sectionTitle}>Friend requests</Text>
          {incomingRequests.map((req) => (
            <FriendRequestItem
              key={req.id}
              request={req}
              onAccept={handleAccept}
              onDecline={handleDecline}
              onPress={handleRequestPress}
            />
          ))}
        </View>
      ) : null}
      {incomingRequests.length > 0 && filteredFriends.length > 0 ? (
        <Text style={styles.friendsSubheading}>Your friends</Text>
      ) : null}
    </>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} onPress={handleMessagesPress}>
            <Icon name="chat" size={24} color={colors.black} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleNotificationsPress}
          >
            <View style={styles.iconWrap}>
              <Icon name="notifications" size={24} color={colors.black} />
              {unreadCount > 0 ? (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>
                    {unreadCount > 9 ? '9+' : String(unreadCount)}
                  </Text>
                </View>
              ) : null}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleAddFriendPress}
          >
            <Icon name="add" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredFriends}
        renderItem={renderFriend}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={listHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          filteredFriends.length > 0 ? null : searchQuery.trim() ? (
            <Text style={styles.emptyFriendsHint}>No friends match your search.</Text>
          ) : friends.length === 0 && incomingRequests.length === 0 ? (
            <Text style={styles.emptyFriendsHint}>
              No friends yet. Tap + to find people and send requests.
            </Text>
          ) : null
        }
      />
    </View>
  );
};

export default Friends;

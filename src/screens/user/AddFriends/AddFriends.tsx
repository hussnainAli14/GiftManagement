import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, ScrollView, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AddFriendSearchBar, FriendRequestItem, AddFriendUserItem } from '../../../components';
import type { SearchCriteria } from '../../../components/AddFriendSearchBar';
import type { FriendRequest } from '../../../components/FriendRequestItem';
import type { AddFriendUser } from '../../../components/AddFriendUserItem';
import {
  acceptFriendRequestApi,
  declineFriendRequestApi,
  getFriendsApi,
  getPendingFriendRequestsApi,
  getSentFriendRequestsApi,
  sendFriendRequestApi,
} from '../../../api/friendApi';
import { searchUsersApi } from '../../../api/userApi';
import { colors } from '../../../theme';
import { styles } from './styles';

type AddFriendsStackParamList = {
  AddFriends: undefined;
  FriendProfile: {
    friendId: string;
    friendName: string;
    friendAvatar: string;
    friendEmail?: string;
  };
};

type AddFriendsScreenNavigationProp = NativeStackNavigationProp<
  AddFriendsStackParamList,
  'AddFriends'
>;

const AddFriends = () => {
  const navigation = useNavigation<AddFriendsScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCriteria, setSelectedCriteria] = useState<SearchCriteria>('username');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
  const [otherUsers, setOtherUsers] = useState<AddFriendUser[]>([]);
  const [friendUserIds, setFriendUserIds] = useState<Set<string>>(() => new Set());
  const [addingFriendId, setAddingFriendId] = useState<string | null>(null);

  const loadFriendIds = useCallback(async () => {
    try {
      const friends = await getFriendsApi();
      setFriendUserIds(new Set(friends.map((f) => f.friend._id)));
    } catch {
      setFriendUserIds(new Set());
    }
  }, []);

  const loadRequests = useCallback(async () => {
    try {
      const [pending, sent] = await Promise.all([getPendingFriendRequestsApi(), getSentFriendRequestsApi()]);
      setIncomingRequests(
        pending.map((request) => {
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
          } as FriendRequest;
        })
      );
      setOutgoingRequests(
        sent.map((request) => {
          const receiver = request.receiver;
          const fullName = receiver?.name || 'User';
          const parts = fullName.split(' ');
          return {
            id: request._id,
            firstName: parts[0] || fullName,
            lastName: parts.slice(1).join(' '),
            name: fullName,
            avatar: receiver?.avatar ?? '',
            mutualFriendsCount: 0,
            type: 'outgoing',
            peerUserId: receiver?._id,
            peerEmail: receiver?.email,
          } as FriendRequest;
        })
      );
    } catch {
      setIncomingRequests([]);
      setOutgoingRequests([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRequests();
      loadFriendIds();
    }, [loadFriendIds, loadRequests])
  );

  const handleSearch = async () => {
    setHasSearched(true);
    if (!searchQuery.trim()) {
      setOtherUsers([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    try {
      // Backend: GET /users/search?q= — may include friendshipStatus (friend / pending / available).
      const [users, friendsRes] = await Promise.all([
        searchUsersApi(searchQuery.trim()),
        getFriendsApi().catch(() => []),
      ]);
      setFriendUserIds(new Set(friendsRes.map((f) => f.friend._id)));
      setOtherUsers(
        users.map((user) => ({
          id: user._id,
          name: user.name || user.email || 'User',
          avatar: user.avatar ?? '',
          email: user.email,
          friendshipStatus: user.friendshipStatus,
        }))
      );
    } catch {
      setOtherUsers([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAccept = async (request: FriendRequest) => {
    await acceptFriendRequestApi(request.id);
    await loadRequests();
    await loadFriendIds();
  };

  const handleDecline = async (request: FriendRequest) => {
    await declineFriendRequestApi(request.id);
    loadRequests();
  };

  const handleCancel = async (request: FriendRequest) => {
    await declineFriendRequestApi(request.id);
    loadRequests();
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

  const handleUserPress = (user: AddFriendUser) => {
    navigation.navigate('FriendProfile', {
      friendId: user.id,
      friendName: user.name,
      friendAvatar: typeof user.avatar === 'string' ? user.avatar : '',
      friendEmail: user.email,
    });
  };

  const handleAddFriend = async (user: AddFriendUser) => {
    if (addingFriendId) return;
    try {
      setAddingFriendId(user.id);
      await sendFriendRequestApi(user.id);
      setOtherUsers((prev) => prev.filter((entry) => entry.id !== user.id));
      await loadRequests();
      await loadFriendIds();
      Alert.alert('Friend request sent', `A request was sent to ${user.name}.`);
    } catch (e) {
      Alert.alert(
        'Could not send request',
        e instanceof Error ? e.message : 'Please try again.'
      );
    } finally {
      setAddingFriendId(null);
    }
  };

  // Filter requests by search query when user has searched
  const q = searchQuery.trim().toLowerCase();
  const filteredIncoming = hasSearched && q
    ? incomingRequests.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.firstName.toLowerCase().includes(q) ||
          r.lastName.toLowerCase().includes(q) ||
          (r.peerEmail?.toLowerCase().includes(q) ?? false)
      )
    : incomingRequests;

  const filteredOutgoing = hasSearched && q
    ? outgoingRequests.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.firstName.toLowerCase().includes(q) ||
          r.lastName.toLowerCase().includes(q) ||
          (r.peerEmail?.toLowerCase().includes(q) ?? false)
      )
    : outgoingRequests;

  /** Peers with an incoming or outgoing pending request — do not show again under People. */
  const pendingPeerIds = useMemo(() => {
    const s = new Set<string>();
    incomingRequests.forEach((r) => {
      if (r.peerUserId) s.add(r.peerUserId);
    });
    outgoingRequests.forEach((r) => {
      if (r.peerUserId) s.add(r.peerUserId);
    });
    return s;
  }, [incomingRequests, outgoingRequests]);

  const filteredOtherUsers = useMemo(
    () =>
      otherUsers.filter((u) => {
        if (friendUserIds.has(u.id)) return false;
        if (pendingPeerIds.has(u.id)) return false;
        const st = u.friendshipStatus;
        if (st === 'friend' || st === 'pending') return false;
        return true;
      }),
    [otherUsers, friendUserIds, pendingPeerIds]
  );

  const renderIncoming = ({ item }: { item: FriendRequest }) => (
    <FriendRequestItem
      request={item}
      onAccept={handleAccept}
      onDecline={handleDecline}
      onPress={handleRequestPress}
    />
  );

  const renderOutgoing = ({ item }: { item: FriendRequest }) => (
    <FriendRequestItem
      request={item}
      onCancel={handleCancel}
      onPress={handleRequestPress}
    />
  );

  const renderOtherUser = ({ item }: { item: AddFriendUser }) => (
    <AddFriendUserItem
      user={item}
      onAddFriend={handleAddFriend}
      onPress={handleUserPress}
      addRequestLoading={addingFriendId === item.id}
    />
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Bar (second image) */}
        <View style={styles.searchSection}>
          <AddFriendSearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            selectedCriteria={selectedCriteria}
            onCriteriaChange={setSelectedCriteria}
            onSearch={handleSearch}
            placeholder="Search by username..."
          />
        </View>

        {searchLoading ? (
          <View style={styles.searchStatusRow}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : null}

        {hasSearched && searchQuery.trim() && !searchLoading && otherUsers.length === 0 ? (
          <View style={styles.searchStatusRow}>
            <Text style={styles.emptySearchText}>
              No users found. Try another name, email, or phone number.
            </Text>
          </View>
        ) : null}

        {hasSearched &&
        searchQuery.trim() &&
        !searchLoading &&
        otherUsers.length > 0 &&
        filteredOtherUsers.length === 0 ? (
          <View style={styles.searchStatusRow}>
            <Text style={styles.emptySearchText}>
              Everyone matching your search is already a friend or has a pending request.
            </Text>
          </View>
        ) : null}

        {/* Incoming Requests */}
        {filteredIncoming.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Incoming Requests</Text>
            <FlatList
              data={filteredIncoming}
              renderItem={renderIncoming}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Outgoing Requests */}
        {filteredOutgoing.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Outgoing Requests</Text>
            <FlatList
              data={filteredOutgoing}
              renderItem={renderOutgoing}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Other users (not in requests) - Add Friend card style; shown when searched or as suggested */}
        {filteredOtherUsers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {hasSearched || searchQuery.trim() ? 'People' : 'Suggested'}
            </Text>
            <FlatList
              data={filteredOtherUsers}
              renderItem={renderOtherUser}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default AddFriends;

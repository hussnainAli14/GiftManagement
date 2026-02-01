import React, { useState } from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AddFriendSearchBar, FriendRequestItem, AddFriendUserItem } from '../../../components';
import type { SearchCriteria } from '../../../components/AddFriendSearchBar';
import type { FriendRequest } from '../../../components/FriendRequestItem';
import type { AddFriendUser } from '../../../components/AddFriendUserItem';
import { colors } from '../../../theme';
import { typography } from '../../../theme';
import { styles } from './styles';

type AddFriendsStackParamList = {
  AddFriends: undefined;
  FriendProfile: {
    friendId: string;
    friendName: string;
    friendAvatar: string;
  };
};

type AddFriendsScreenNavigationProp = NativeStackNavigationProp<
  AddFriendsStackParamList,
  'AddFriends'
>;

// Mock data - replace with real API data when integrating
const incomingRequests: FriendRequest[] = [
  {
    id: '1',
    firstName: 'Saqlin',
    lastName: 'Ahmed',
    name: 'Saqlin Ahmed',
    avatar: 'https://i.pravatar.cc/150?img=12',
    mutualFriendsCount: 5,
    type: 'incoming',
  },
  {
    id: '2',
    firstName: 'Hassam',
    lastName: 'Khan',
    name: 'Hassam Khan',
    avatar: 'https://i.pravatar.cc/150?img=13',
    mutualFriendsCount: 12,
    type: 'incoming',
  },
  {
    id: '3',
    firstName: 'Usman',
    lastName: 'Ali',
    name: 'Usman Ali',
    avatar: 'https://i.pravatar.cc/150?img=14',
    mutualFriendsCount: 3,
    type: 'incoming',
  },
];

const outgoingRequests: FriendRequest[] = [
  {
    id: '4',
    firstName: 'Aisha',
    lastName: 'Rahman',
    name: 'Aisha Rahman',
    avatar: 'https://i.pravatar.cc/150?img=8',
    mutualFriendsCount: 8,
    type: 'outgoing',
  },
  {
    id: '5',
    firstName: 'Fatima',
    lastName: 'Zahra',
    name: 'Fatima Zahra',
    avatar: 'https://i.pravatar.cc/150?img=9',
    mutualFriendsCount: 1,
    type: 'outgoing',
  },
  {
    id: '6',
    firstName: 'Ibrahim',
    lastName: 'Malik',
    name: 'Ibrahim Malik',
    avatar: 'https://i.pravatar.cc/150?img=10',
    mutualFriendsCount: 7,
    type: 'outgoing',
  },
  {
    id: '7',
    firstName: 'Mariam',
    lastName: 'Hassan',
    name: 'Mariam Hassan',
    avatar: 'https://i.pravatar.cc/150?img=11',
    mutualFriendsCount: 10,
    type: 'outgoing',
  },
];

// Users not in requests (search results / all users)
const otherUsers: AddFriendUser[] = [
  {
    id: '8',
    name: 'Saqlain',
    avatar: 'https://i.pravatar.cc/150?img=15',
  },
  {
    id: '9',
    name: 'Ahmed Khan',
    avatar: 'https://i.pravatar.cc/150?img=16',
  },
];

const AddFriends = () => {
  const navigation = useNavigation<AddFriendsScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCriteria, setSelectedCriteria] = useState<SearchCriteria>('username');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    setHasSearched(true);
    // In real app: filter incoming/outgoing by searchQuery + criteria, or fetch all users
  };

  const handleAccept = (request: FriendRequest) => {
    console.log('Accept:', request);
  };

  const handleDecline = (request: FriendRequest) => {
    console.log('Decline:', request);
  };

  const handleCancel = (request: FriendRequest) => {
    console.log('Cancel:', request);
  };

  const handleRequestPress = (request: FriendRequest) => {
    navigation.navigate('FriendProfile', {
      friendId: request.id,
      friendName: request.name,
      friendAvatar: typeof request.avatar === 'string' ? request.avatar : '',
    });
  };

  const handleUserPress = (user: AddFriendUser) => {
    navigation.navigate('FriendProfile', {
      friendId: user.id,
      friendName: user.name,
      friendAvatar: typeof user.avatar === 'string' ? user.avatar : '',
    });
  };

  const handleAddFriend = (user: AddFriendUser) => {
    console.log('Add friend:', user);
  };

  // Filter requests by search query when user has searched
  const filteredIncoming = hasSearched && searchQuery.trim()
    ? incomingRequests.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : incomingRequests;

  const filteredOutgoing = hasSearched && searchQuery.trim()
    ? outgoingRequests.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : outgoingRequests;

  // Other users: filter by search when user has searched; otherwise show all (e.g. suggested)
  const filteredOtherUsers =
    hasSearched && searchQuery.trim()
      ? otherUsers.filter((u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : otherUsers;

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

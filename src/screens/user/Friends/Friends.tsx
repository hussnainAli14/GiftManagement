import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Search, FriendItem } from '../../../components';
import type { Friend } from '../../../components/FriendItem';
import { colors } from '../../../theme';
import { typography } from '../../../theme';
import { styles } from './styles';

type FriendsStackParamList = {
  FriendsMain: undefined;
  AddFriends: undefined;
  Notifications: undefined;
  FriendProfile: {
    friendId: string;
    friendName: string;
    friendAvatar: string;
  };
};

type FriendsScreenNavigationProp = NativeStackNavigationProp<FriendsStackParamList, 'FriendsMain'>;

// Mock data - replace with real API data when integrating
const friends: Friend[] = [
  {
    id: '1',
    name: 'Saqlain Khan',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: '2',
    name: 'Hassam Ahmed',
    avatar: 'https://i.pravatar.cc/150?img=6',
  },
  {
    id: '3',
    name: 'Usman Ali',
    avatar: 'https://i.pravatar.cc/150?img=7',
  },
  {
    id: '4',
    name: 'Aisha Rahman',
    avatar: 'https://i.pravatar.cc/150?img=8',
  },
  {
    id: '5',
    name: 'Fatima Zahra',
    avatar: 'https://i.pravatar.cc/150?img=9',
  },
  {
    id: '6',
    name: 'Ibrahim Malik',
    avatar: 'https://i.pravatar.cc/150?img=10',
  },
  {
    id: '7',
    name: 'Mariam Hassan',
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
];

const Friends = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<FriendsScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');

  const handleNotificationsPress = () => {
    navigation.navigate('Notifications');
  };

  const handleFriendPress = (friend: Friend) => {
    navigation.navigate('FriendProfile', {
      friendId: friend.id,
      friendName: friend.name,
      friendAvatar: typeof friend.avatar === 'string' ? friend.avatar : '',
    });
  };

  const handleAddFriendPress = () => {
    navigation.navigate('AddFriends');
  };

  // Filter friends based on search query
  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFriend = ({ item }: { item: Friend }) => (
    <FriendItem friend={item} onPress={handleFriendPress} />
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleNotificationsPress}
          >
            <Icon name="notifications" size={24} color={colors.black} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleAddFriendPress}
          >
            <Icon name="add" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search
          placeholder="Search friends..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Friends List */}
      <FlatList
        data={filteredFriends}
        renderItem={renderFriend}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Friends;

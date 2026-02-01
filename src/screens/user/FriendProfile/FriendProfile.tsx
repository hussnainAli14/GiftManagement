import React from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HorizontalEventCard, WishlistItem, GiftHistoryItem } from '../../../components';
import type { HorizontalEvent } from '../../../components/HorizontalEventCard';
import type { WishlistItem as WishlistItemType } from '../../../components/WishlistItem';
import type { GiftHistoryItem as GiftHistoryItemType } from '../../../components/GiftHistoryItem';
import { colors } from '../../../theme';
import { typography } from '../../../theme';
import { styles } from './styles';

type FriendProfileRouteParams = {
  FriendProfile: {
    friendId: string;
    friendName: string;
    friendAvatar: string;
  };
};

type FriendProfileRouteProp = RouteProp<FriendProfileRouteParams, 'FriendProfile'>;

// Mock data - replace with real API data when integrating
const upcomingEvents: HorizontalEvent[] = [
  {
    id: '1',
    title: "Sara's Birthday",
    date: 'July 20, 2026',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400',
  },
  {
    id: '2',
    title: 'Summer Mixer',
    date: 'August 15',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400',
  },
];

const wishlists: WishlistItemType[] = [
  {
    id: '1',
    title: 'Espresso Machine',
    price: 'PKR 299.99',
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400',
    status: 'Pending',
  },
  {
    id: '2',
    title: 'Noise-Canceling Headphones',
    price: 'PKR 179.00',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    status: 'Fulfilled',
  },
];

const giftHistory: GiftHistoryItemType[] = [
  {
    id: '1',
    recipient: 'Usman Ahmed',
    date: 'May 10, 2026',
    type: 'sent',
    icon: 'gift',
  },
  {
    id: '2',
    sender: 'Fatima Hassan',
    date: 'April 22, 2026',
    type: 'received',
    icon: 'shield',
  },
  {
    id: '3',
    recipient: 'Community Outreach',
    date: 'March 01, 2026',
    type: 'sent',
    icon: 'heart',
  },
  {
    id: '4',
    recipient: 'Ibrahim Saqlin',
    date: 'January 15, 2026',
    type: 'sent',
    icon: 'gift',
  },
  {
    id: '5',
    sender: 'Mariam Farooq',
    date: 'December 03, 2026',
    type: 'received',
    icon: 'shield',
  },
];

const FriendProfile = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute<FriendProfileRouteProp>();
  const navigation = useNavigation();
  const { friendName, friendAvatar } = route.params;

  const handleViewAllEvents = () => {
    console.log('View all events');
  };

  const handleViewAllWishlists = () => {
    console.log('View all wishlists');
  };

  const handleMessagePress = () => {
    console.log('Message pressed');
  };

  const handleMoreOptionsPress = () => {
    console.log('More options pressed');
  };

  const renderEvent = ({ item }: { item: HorizontalEvent }) => (
    <HorizontalEventCard event={item} />
  );

  const renderWishlist = ({ item }: { item: WishlistItemType }) => (
    <WishlistItem item={item} />
  );

  const renderGiftHistory = ({ item }: { item: GiftHistoryItemType }) => (
    <GiftHistoryItem item={item} />
  );

  const DEFAULT_AVATAR = 'https://picsum.photos/seed/avatar/200/200';
  const avatarSource = friendAvatar
    ? (typeof friendAvatar === 'string' ? { uri: friendAvatar } : friendAvatar)
    : { uri: DEFAULT_AVATAR };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image source={avatarSource} style={styles.avatar} />
          <Text style={styles.friendName}>{friendName}</Text>
          <View style={styles.profileActions}>
            <TouchableOpacity
              style={styles.messageButton}
              onPress={handleMessagePress}
            >
              <Icon name="message" size={20} color={colors.white} />
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.moreButton}
              onPress={handleMoreOptionsPress}
            >
              <Icon name="more-vert" size={24} color={colors.black} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Events Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <TouchableOpacity onPress={handleViewAllEvents}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={upcomingEvents}
            renderItem={renderEvent}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Wishlists Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Wishlists</Text>
            <TouchableOpacity onPress={handleViewAllWishlists}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={wishlists}
            renderItem={renderWishlist}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Gift History Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gift History</Text>
          <FlatList
            data={giftHistory}
            renderItem={renderGiftHistory}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default FriendProfile;

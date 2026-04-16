import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useFocusEffect, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HorizontalEventCard, WishlistItem, GiftHistoryItem } from '../../../components';
import type { HorizontalEvent } from '../../../components/HorizontalEventCard';
import type { WishlistItem as WishlistItemType } from '../../../components/WishlistItem';
import type { GiftHistoryItem as GiftHistoryItemType } from '../../../components/GiftHistoryItem';
import { colors } from '../../../theme';
import { styles } from './styles';
import { getAvatarImageSource } from '../../../utils/resolveUserAvatar';
import { useAuth } from '../../../context/AuthContext';
import { getUserByIdApi } from '../../../api/userApi';
import type { UserProfile } from '../../../api/userApi';
import { getEventsByUserApi, type EventModel } from '../../../api/eventApi';
import { getWishlistByEventApi } from '../../../api/wishlistApi';
import type { WishlistItemModel } from '../../../api/wishlistApi';
import { getGiftHistoryWithUserApi } from '../../../api/orderApi';
import type { OrderModel } from '../../../api/orderApi';
import { API_ORIGIN } from '../../../api/config';
import type { ChatThreadParams } from '../../../navigation/messagingParams';

type FriendProfileRouteParams = {
  FriendProfile: {
    friendId: string;
    friendName: string;
    friendAvatar?: string;
    friendEmail?: string;
  };
};

type FriendProfileRouteProp = RouteProp<FriendProfileRouteParams, 'FriendProfile'>;

type FriendProfileNavProp = NativeStackNavigationProp<
  { FriendProfile: FriendProfileRouteParams['FriendProfile']; ChatThread: ChatThreadParams },
  'FriendProfile'
>;

function formatEventDate(iso: string | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function eventModelToCard(e: { _id: string; name?: string; date?: string }): HorizontalEvent {
  return {
    id: e._id,
    title: e.name ?? 'Event',
    date: formatEventDate(e.date),
    image: `https://picsum.photos/seed/event-${e._id}/400/220`,
  };
}

function resolveWishlistImageUrl(raw: string | undefined, seed: string): string {
  const t = raw?.trim();
  if (!t) return `https://picsum.photos/seed/wl-${seed}/400/300`;
  if (/^https?:\/\//i.test(t) || t.startsWith('data:')) return t;
  if (t.startsWith('/')) return `${API_ORIGIN}${t}`;
  return t;
}

function wishlistItemToCard(it: WishlistItemModel, seed: string): WishlistItemType {
  const status = it.status === 'gifted' ? 'Fulfilled' : 'Pending';
  const price =
    typeof it.price === 'number' && !Number.isNaN(it.price)
      ? `PKR ${it.price.toFixed(2)}`
      : '—';
  const id = typeof it._id === 'string' ? it._id : seed;
  return {
    id,
    title: it.title || 'Wishlist item',
    price,
    image: resolveWishlistImageUrl(it.image, id),
    status,
  };
}

function orderToGiftHistory(o: OrderModel, currentUserId: string): GiftHistoryItemType | null {
  if (!o.recipientId) return null;

  const buyer =
    typeof o.userId === 'object' && o.userId && 'name' in o.userId
      ? (o.userId as { name?: string }).name ?? 'User'
      : 'User';
  const recipient =
    typeof o.recipientId === 'object' && 'name' in o.recipientId
      ? (o.recipientId as { name?: string }).name ?? 'Recipient'
      : 'Recipient';

  const buyerId =
    typeof o.userId === 'object' && o.userId && '_id' in o.userId
      ? String((o.userId as { _id: string })._id)
      : String(o.userId ?? '');

  const isSent = buyerId === currentUserId;
  const dateStr = o.createdAt
    ? new Date(o.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return {
    id: o._id,
    type: isSent ? 'sent' : 'received',
    recipient,
    sender: buyer,
    date: dateStr,
    icon: 'gift',
  };
}

const FriendProfile = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute<FriendProfileRouteProp>();
  const navigation = useNavigation<FriendProfileNavProp>();
  const { user: authUser } = useAuth();
  const { friendId, friendName, friendEmail: paramEmail, friendAvatar } = route.params;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [events, setEvents] = useState<HorizontalEvent[]>([]);
  const [wishlistCards, setWishlistCards] = useState<WishlistItemType[]>([]);
  const [giftHistory, setGiftHistory] = useState<GiftHistoryItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  /** If the real avatar URL fails to load, fall back to initials (same as friends list). */
  const [avatarBroken, setAvatarBroken] = useState(false);

  const displayName = profile?.name?.trim() || friendName || 'Friend';
  const displayEmail =
    profile?.email?.trim() || paramEmail?.trim() || '';

  const rawAvatar = useMemo(
    () => (profile?.avatar?.trim() || friendAvatar?.trim() || '') as string,
    [profile?.avatar, friendAvatar]
  );

  const avatarSource = useMemo(
    () => getAvatarImageSource(avatarBroken ? '' : rawAvatar, displayName),
    [avatarBroken, rawAvatar, displayName]
  );

  useEffect(() => {
    setAvatarBroken(false);
  }, [friendId, rawAvatar]);

  const load = useCallback(async () => {
    if (!friendId) {
      setError('Missing friend profile.');
      setLoading(false);
      return;
    }
    const me = authUser?.id;
    setLoading(true);
    setError(null);
    try {
      let userRes: UserProfile | null = null;
      try {
        userRes = await getUserByIdApi(friendId);
      } catch {
        userRes = null;
      }
      setProfile(userRes);

      let evs: EventModel[] = [];
      try {
        evs = await getEventsByUserApi(friendId);
      } catch {
        evs = [];
      }

      const eventCards = (evs ?? []).map(eventModelToCard);
      setEvents(eventCards);

      let orders: OrderModel[] = [];
      if (me) {
        try {
          orders = await getGiftHistoryWithUserApi(friendId);
        } catch {
          orders = [];
        }
      }

      const wishIds = (evs ?? []).map((e) => e._id).slice(0, 20);
      let wishResults: (Awaited<ReturnType<typeof getWishlistByEventApi>> | null)[] = [];
      try {
        wishResults = await Promise.all(
          wishIds.map((eventId) => getWishlistByEventApi(eventId).catch(() => null))
        );
      } catch {
        wishResults = [];
      }

      const flat: WishlistItemType[] = [];
      const seen = new Set<string>();
      wishResults.forEach((wl, idx) => {
        if (!wl?.items?.length) return;
        const owner =
          typeof wl.userId === 'object' && wl.userId && '_id' in wl.userId
            ? String((wl.userId as { _id: string })._id)
            : String(wl.userId ?? '');
        if (owner !== friendId) return;
        wl.items.forEach((it: WishlistItemModel, j: number) => {
          const id = typeof it._id === 'string' ? it._id : `i-${idx}-${j}`;
          if (seen.has(id)) return;
          seen.add(id);
          flat.push(wishlistItemToCard(it, id));
        });
      });
      setWishlistCards(flat.slice(0, 24));

      const gifts = me
        ? (orders ?? [])
            .map((o) => orderToGiftHistory(o, me))
            .filter((g): g is GiftHistoryItemType => g != null)
        : [];
      setGiftHistory(gifts);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load profile.');
      setProfile(null);
      setEvents([]);
      setWishlistCards([]);
      setGiftHistory([]);
    } finally {
      setLoading(false);
    }
  }, [friendId, authUser?.id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleViewAllEvents = () => {
    // Navigate to full list when that flow exists
  };

  const handleViewAllWishlists = () => {
    // Navigate to full list when that flow exists
  };

  const handleMessagePress = () => {
    navigation.navigate('ChatThread', {
      peerUserId: friendId,
      peerName: displayName,
      peerAvatar: rawAvatar || undefined,
    });
  };

  const handleMoreOptionsPress = () => {
    // Options menu not wired
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

  return (
    <View style={[styles.container]}>
      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : null}

        <View style={styles.profileSection}>
          <Image
            source={avatarSource}
            style={styles.avatar}
            onError={() => setAvatarBroken(true)}
          />
          <Text style={styles.friendName}>{displayName}</Text>
          {displayEmail ? (
            <Text style={styles.friendEmail} numberOfLines={2}>
              {displayEmail}
            </Text>
          ) : null}
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

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <TouchableOpacity onPress={handleViewAllEvents}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {events.length === 0 ? (
            <Text style={styles.emptyHint}>No upcoming events to show.</Text>
          ) : (
            <FlatList
              data={events}
              renderItem={renderEvent}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Wishlists</Text>
            <TouchableOpacity onPress={handleViewAllWishlists}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {wishlistCards.length === 0 ? (
            <Text style={styles.emptyHint}>No wishlist items to show yet.</Text>
          ) : (
            <FlatList
              data={wishlistCards}
              renderItem={renderWishlist}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gift History</Text>
          {giftHistory.length === 0 ? (
            <Text style={styles.emptyHint}>
              No gift orders between you and this friend yet.
            </Text>
          ) : (
            <FlatList
              data={giftHistory}
              renderItem={renderGiftHistory}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default FriendProfile;

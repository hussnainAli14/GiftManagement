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
import { getWishlistByEventApi, getWishlistByUserApi } from '../../../api/wishlistApi';
import { filterAvailableWishlistItems } from '../../../utils/isWishlistItemAvailable';
import type { WishlistItemModel, WishlistModel } from '../../../api/wishlistApi';
import type { PersonsWishlistItemData } from '../../../components/PersonsWishlistItem';
import { normalizeUserId } from '../../../utils/normalizeUserId';
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

function wishlistItemToGiftData(it: WishlistItemModel, seed: string): PersonsWishlistItemData {
  const price =
    typeof it.price === 'number' && !Number.isNaN(it.price)
      ? `PKR ${it.price.toLocaleString('en-PK')}`
      : 'PKR 0';
  const id = typeof it._id === 'string' ? it._id : seed;
  const target = it.contributionTarget ?? it.price ?? 0;
  const progress = it.contributionProgress ?? 0;
  const contributedPercent = target
    ? Math.round(Math.max(0, Math.min(100, (progress / target) * 100)))
    : 0;

  return {
    id,
    title: it.title || 'Wishlist item',
    description: it.description ?? '',
    price,
    image: resolveWishlistImageUrl(it.image, id),
    contributedPercent,
    contributionTarget: target,
    contributionProgress: progress,
    category: it.category,
    vendorName: it.vendorName,
  };
}

type FriendWishlistEntry = {
  card: WishlistItemType;
  giftItem: PersonsWishlistItemData;
};

function appendFriendWishlistItems(
  wishlist: WishlistModel | null,
  friendId: string,
  seen: Set<string>,
  flat: FriendWishlistEntry[],
  seedPrefix: string,
) {
  if (!wishlist?.items?.length) return;

  const owner = normalizeUserId(wishlist.userId);
  if (owner !== friendId) return;

  // Personal favorites stay visible even after they have been gifted.
  const sourceItems =
    seedPrefix === 'personal'
      ? wishlist.items
      : filterAvailableWishlistItems(wishlist.items);

  sourceItems.forEach((it: WishlistItemModel, j: number) => {
    const id = typeof it._id === 'string' ? it._id : `${seedPrefix}-${j}`;
    if (seen.has(id)) return;
    seen.add(id);
    flat.push({
      card: wishlistItemToCard(it, id),
      giftItem: wishlistItemToGiftData(it, id),
    });
  });
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
  const [wishlistEntries, setWishlistEntries] = useState<FriendWishlistEntry[]>([]);
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
      let personalWishlist: Awaited<ReturnType<typeof getWishlistByUserApi>> | null = null;
      try {
        [personalWishlist, ...wishResults] = await Promise.all([
          getWishlistByUserApi(friendId).catch(() => null),
          ...wishIds.map((eventId) => getWishlistByEventApi(eventId).catch(() => null)),
        ]);
      } catch {
        wishResults = [];
        personalWishlist = null;
      }

      const flat: FriendWishlistEntry[] = [];
      const seen = new Set<string>();
      appendFriendWishlistItems(personalWishlist, friendId, seen, flat, 'personal');
      wishResults.forEach((wl, idx) => {
        appendFriendWishlistItems(wl, friendId, seen, flat, `event-${idx}`);
      });
      setWishlistEntries(flat.slice(0, 24));

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
      setWishlistEntries([]);
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

  const handleSendGift = () => {
    navigation.getParent()?.navigate('Home', {
      screen: 'PersonsWishlist',
      params: {
        userId: friendId,
        eventTitle: `${displayName}'s Favorite Products`,
      },
    });
  };

  const handleViewAllWishlists = () => {
    navigation.getParent()?.navigate('Home', {
      screen: 'PersonsWishlist',
      params: {
        userId: friendId,
        eventTitle: `${displayName}'s Favorite Products`,
      },
    });
  };

  const handleWishlistPress = (entry: FriendWishlistEntry) => {
    navigation.getParent()?.navigate('Events', {
      screen: 'GiftOptions',
      params: {
        item: entry.giftItem,
        eventTitle: `${displayName}'s Wishlist`,
        wishlistOwnerId: friendId,
        eventOwnerId: friendId,
      },
    });
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

  const renderWishlist = ({ item }: { item: FriendWishlistEntry }) => (
    <WishlistItem item={item.card} onPress={() => handleWishlistPress(item)} />
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
              style={styles.sendGiftButton}
              onPress={handleSendGift}
            >
              <Icon name="card-giftcard" size={20} color={colors.white} />
              <Text style={styles.messageButtonText}>Send Gift</Text>
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
            <Text style={styles.sectionTitle}>Favorite Products</Text>
            <TouchableOpacity onPress={handleViewAllWishlists}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {wishlistEntries.length === 0 ? (
            <Text style={styles.emptyHint}>No favorite products to show yet.</Text>
          ) : (
            <FlatList
              data={wishlistEntries}
              renderItem={renderWishlist}
              keyExtractor={(item) => item.card.id}
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

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PersonsWishlistItem } from '../../../components';
import type { PersonsWishlistItemData } from '../../../components/PersonsWishlistItem';
import type { PersonsWishlistParams } from './types';
import { styles } from './styles';
import { getWishlistByEventApi, getWishlistByUserApi, getOrCreatePersonalWishlistApi, type WishlistItemModel } from '../../../api/wishlistApi';
import { getNonWishlistByEventApi, getNonWishlistByUserApi, type NonWishlistItemModel } from '../../../api/nonWishlistApi';
import { getMyEventsApi, type EventModel } from '../../../api/eventApi';
import { useAuth } from '../../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../../theme';
import { deleteWishlistItemApi } from '../../../api/wishlistApi';
import { filterWishlistItemsForViewer } from '../../../utils/isWishlistItemAvailable';
import { deleteNonWishlistItemApi } from '../../../api/nonWishlistApi';
import { normalizeUserId } from '../../../utils/normalizeUserId';
import type { ProductModel } from '../../../api/productApi';

type PersonsWishlistRouteProp = RouteProp<
  { params: PersonsWishlistParams },
  'params'
>;

type PersonsWishlistStackParamList = {
  PersonsWishlist: PersonsWishlistParams;
  GiftOptions: {
    item: PersonsWishlistItemData;
    eventTitle?: string;
    eventId?: string;
    wishlistOwnerId?: string;
    eventOwnerId?: string;
  };
  BrowseVendorProducts: {
    eventId?: string;
    userId?: string;
    listType?: 'wishlist' | 'nonWishlist';
    cityOwnerUserId?: string;
  };
  VendorProductDetail: { product: ProductModel; eventId?: string; listType?: 'wishlist' | 'nonWishlist' };
  EditItem: { item: any; listType?: 'wishlist' | 'nonWishlist' };
};

type TabType = 'wishlist' | 'nonWishlist';

const PersonsWishlist = () => {
  const route = useRoute<PersonsWishlistRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<PersonsWishlistStackParamList, 'PersonsWishlist'>>();
  const eventTitle = route.params?.eventTitle;
  const listUserId = route.params?.userId;
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('wishlist');

  const [resolvedEventId, setResolvedEventId] = useState<string | undefined>(route.params?.eventId);
  const [wishlistItems, setWishlistItems] = useState<PersonsWishlistItemData[]>([]);
  const [nonWishlistItems, setNonWishlistItems] = useState<PersonsWishlistItemData[]>([]);
  const [loading, setLoading] = useState(false);
  const [ownerUserId, setOwnerUserId] = useState<string | null>(null);
  const [eventOwnerUserId, setEventOwnerUserId] = useState<string | null>(null);

  const contributedPercent = useCallback((item: Partial<WishlistItemModel>) => {
    const progress = item.contributionProgress ?? 0;
    const target = item.contributionTarget ?? 0;
    if (!target) return 0;
    const raw = (progress / target) * 100;
    const clamped = Math.max(0, Math.min(100, raw));
    return Math.round(clamped);
  }, []);

  const formatPrice = useCallback((n: number | undefined) => {
    if (!n && n !== 0) return 'PKR 0';
    return `PKR ${n.toLocaleString('en-PK')}`;
  }, []);

  const mapWishlistItem = useCallback(
    (item: WishlistItemModel): PersonsWishlistItemData => ({
      id: item._id,
      title: item.title,
      description: item.description ?? '',
      price: formatPrice(item.price),
      image: item.image ?? 'https://picsum.photos/seed/wishlist/400/200',
      contributedPercent: contributedPercent(item),
      contributionTarget: item.contributionTarget ?? item.price,
      contributionProgress: item.contributionProgress ?? 0,
      category: item.category,
      vendorName: item.vendorName,
    }),
    [contributedPercent, formatPrice]
  );

  const mapNonWishlistItem = useCallback(
    (item: NonWishlistItemModel): PersonsWishlistItemData => ({
      id: item._id,
      title: item.title ?? 'Item',
      description: item.description ?? '',
      price: formatPrice(item.price),
      image: item.image ?? 'https://picsum.photos/seed/nonwishlist/400/200',
      contributedPercent: 0,
      category: item.category,
      vendorName: item.vendorName,
    }),
    [formatPrice]
  );

  // Resolve eventId from eventTitle (fallback) so other flows work
  useEffect(() => {
    setResolvedEventId(route.params?.eventId);
  }, [route.params?.eventId]);

  useEffect(() => {
    const resolveFromTitle = async () => {
      if (resolvedEventId || !eventTitle) return;
      try {
        const events = await getMyEventsApi();
        const match = events.find((e: EventModel) => e.name === eventTitle);
        if (match?._id) setResolvedEventId(match._id);
      } catch {
        // Keep empty; user can retry.
      }
    };
    resolveFromTitle();
  }, [eventTitle, resolvedEventId]);

  const loadLists = useCallback(async () => {
    const personalUserId = listUserId ?? (!resolvedEventId ? user?.id : undefined);

    if (!resolvedEventId && !personalUserId) {
      setWishlistItems([]);
      setNonWishlistItems([]);
      setOwnerUserId(null);
      setEventOwnerUserId(null);
      return;
    }

    setLoading(true);
    try {
      const [wishlist, nonWishlist] = resolvedEventId
        ? await Promise.all([
            getWishlistByEventApi(resolvedEventId),
            getNonWishlistByEventApi(resolvedEventId),
          ])
        : await Promise.all([
            personalUserId && user?.id && personalUserId === user.id
              ? getOrCreatePersonalWishlistApi()
              : getWishlistByUserApi(personalUserId!),
            getNonWishlistByUserApi(personalUserId!),
          ]);

      const ownerId =
        normalizeUserId(wishlist?.userId) ??
        normalizeUserId(nonWishlist?.userId) ??
        personalUserId ??
        null;
      const eventOwnerId =
        (wishlist?.eventId && typeof wishlist.eventId === 'object'
          ? normalizeUserId(wishlist.eventId.createdBy)
          : undefined) ?? ownerId;
      const viewerIsOwner = !!user?.id && !!ownerId && user.id === ownerId;
      const isPersonalFavorites = !resolvedEventId && !!personalUserId;

      setWishlistItems(
        (isPersonalFavorites
          ? (wishlist?.items ?? [])
          : filterWishlistItemsForViewer(wishlist?.items ?? [], viewerIsOwner)
        ).map(mapWishlistItem)
      );
      setNonWishlistItems((nonWishlist?.items ?? []).map(mapNonWishlistItem));
      setOwnerUserId(ownerId);
      setEventOwnerUserId(eventOwnerId);
    } catch {
      setWishlistItems([]);
      setNonWishlistItems([]);
      setOwnerUserId(null);
      setEventOwnerUserId(null);
    } finally {
      setLoading(false);
    }
  }, [resolvedEventId, listUserId, mapWishlistItem, mapNonWishlistItem, user?.id]);

  // Load when event changes.
  useEffect(() => {
    loadLists();
  }, [loadLists]);

  // Reload when returning from Add/Edit flows.
  useFocusEffect(
    useCallback(() => {
      loadLists();
    }, [loadLists])
  );

  const items = useMemo(
    () => (activeTab === 'wishlist' ? wishlistItems : nonWishlistItems),
    [activeTab, wishlistItems, nonWishlistItems]
  );

  const isOwner = !!user?.id && !!ownerUserId && user.id === ownerUserId;
  const isPersonalFavorites = !resolvedEventId && !!(listUserId ?? user?.id);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 16, gap: 14 }}>
          <TouchableOpacity
            onPress={() => {
              // share placeholder
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="share" size={24} color="#000000" />
          </TouchableOpacity>
          {isOwner && (resolvedEventId || listUserId || user?.id) ? (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('BrowseVendorProducts', {
                  eventId: resolvedEventId,
                  userId: listUserId ?? user?.id,
                  listType: isPersonalFavorites ? 'wishlist' : activeTab,
                  cityOwnerUserId: resolvedEventId ? undefined : (listUserId ?? user?.id),
                });
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="add" size={26} color={colors.primary} />
            </TouchableOpacity>
          ) : null}
        </View>
      ),
    });
  }, [navigation, isOwner, resolvedEventId, listUserId, user?.id, activeTab, isPersonalFavorites]);

  const handleItemPress = (item: PersonsWishlistItemData) => {
    if (activeTab === 'wishlist' || isPersonalFavorites) {
      navigation.navigate('GiftOptions', {
        item,
        eventTitle,
        eventId: resolvedEventId,
        wishlistOwnerId: ownerUserId ?? undefined,
        eventOwnerId: eventOwnerUserId ?? ownerUserId ?? undefined,
      });
    }
  };

  const handleEdit = (item: PersonsWishlistItemData) => {
    if (!isOwner) return;
    navigation.navigate('EditItem', {
      listType: activeTab,
      item: {
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
        statusText: activeTab === 'wishlist' ? 'Contribution Enabled' : 'Non Wishlist Item',
        categoryValue: item.category,
      },
    });
  };

  const handleDelete = (item: PersonsWishlistItemData) => {
    if (!isOwner) return;
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            if (activeTab === 'wishlist') {
              await deleteWishlistItemApi(item.id);
            } else {
              await deleteNonWishlistItemApi(item.id);
            }
            await loadLists();
          } catch (error) {
            Alert.alert('Delete Failed', error instanceof Error ? error.message : 'Unable to delete item');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: PersonsWishlistItemData }) => (
    <PersonsWishlistItem
      item={item}
      onPress={!isOwner && (activeTab === 'wishlist' || isPersonalFavorites) ? handleItemPress : undefined}
      showContributed={false}
      showActions={isOwner}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );

  const renderTab = (tab: TabType, label: string) => {
    const isSelected = activeTab === tab;
    return (
      <TouchableOpacity
        key={tab}
        style={[styles.tab, isSelected && styles.tabSelected]}
        onPress={() => setActiveTab(tab)}
      >
        <Text style={[styles.tabText, isSelected && styles.tabTextSelected]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {isPersonalFavorites ? null : (
        <View style={styles.tabRow}>
          {renderTab('wishlist', 'Wishlist')}
          {renderTab('nonWishlist', 'Non Wishlist')}
        </View>
      )}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={isPersonalFavorites ? wishlistItems : items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={{ padding: 16, color: '#666' }}>
              {isPersonalFavorites
                ? isOwner
                  ? 'No favorite products yet. Tap + to add products from vendors in your city.'
                  : 'This person has not added any favorite products yet.'
                : 'No items found.'}
            </Text>
          }
        />
      )}
    </View>
  );
};

export default PersonsWishlist;

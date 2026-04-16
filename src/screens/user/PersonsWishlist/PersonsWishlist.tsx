import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PersonsWishlistItem } from '../../../components';
import type { PersonsWishlistItemData } from '../../../components/PersonsWishlistItem';
import type { PersonsWishlistParams } from './types';
import { styles } from './styles';
import { getWishlistByEventApi, type WishlistItemModel } from '../../../api/wishlistApi';
import { getNonWishlistByEventApi, type NonWishlistItemModel } from '../../../api/nonWishlistApi';
import { getMyEventsApi, type EventModel } from '../../../api/eventApi';
import { useAuth } from '../../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../../theme';
import { deleteWishlistItemApi } from '../../../api/wishlistApi';
import { deleteNonWishlistItemApi } from '../../../api/nonWishlistApi';

type PersonsWishlistRouteProp = RouteProp<
  { params: PersonsWishlistParams },
  'params'
>;

type PersonsWishlistStackParamList = {
  PersonsWishlist: PersonsWishlistParams;
  GiftOptions: { item: PersonsWishlistItemData; eventTitle?: string };
  AddItem: { eventId?: string; listType?: 'wishlist' | 'nonWishlist' };
  EditItem: { item: any; listType?: 'wishlist' | 'nonWishlist' };
};

type TabType = 'wishlist' | 'nonWishlist';

const PersonsWishlist = () => {
  const route = useRoute<PersonsWishlistRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<PersonsWishlistStackParamList, 'PersonsWishlist'>>();
  const eventTitle = route.params?.eventTitle;
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('wishlist');

  const [resolvedEventId, setResolvedEventId] = useState<string | undefined>(route.params?.eventId);
  const [wishlistItems, setWishlistItems] = useState<PersonsWishlistItemData[]>([]);
  const [nonWishlistItems, setNonWishlistItems] = useState<PersonsWishlistItemData[]>([]);
  const [loading, setLoading] = useState(false);
  const [ownerUserId, setOwnerUserId] = useState<string | null>(null);

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
      category: item.category,
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
    if (!resolvedEventId) {
      setWishlistItems([]);
      setNonWishlistItems([]);
      setOwnerUserId(null);
      return;
    }

    setLoading(true);
    try {
      const [wishlist, nonWishlist] = await Promise.all([
        getWishlistByEventApi(resolvedEventId),
        getNonWishlistByEventApi(resolvedEventId),
      ]);

      setWishlistItems((wishlist?.items ?? []).map(mapWishlistItem));
      setNonWishlistItems((nonWishlist?.items ?? []).map(mapNonWishlistItem));
      setOwnerUserId(wishlist?.userId?._id ?? nonWishlist?.userId?._id ?? null);
    } catch {
      setWishlistItems([]);
      setNonWishlistItems([]);
      setOwnerUserId(null);
    } finally {
      setLoading(false);
    }
  }, [resolvedEventId, mapWishlistItem, mapNonWishlistItem]);

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
          {isOwner ? (
            <TouchableOpacity
              onPress={() => {
                const eventId = resolvedEventId;
                Alert.alert('Add Item', 'Where do you want to add this item?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Wishlist', onPress: () => navigation.navigate('AddItem', { eventId, listType: 'wishlist' }) },
                  { text: 'Non Wishlist', onPress: () => navigation.navigate('AddItem', { eventId, listType: 'nonWishlist' }) },
                ]);
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="add" size={26} color={colors.primary} />
            </TouchableOpacity>
          ) : null}
        </View>
      ),
    });
  }, [navigation, isOwner, resolvedEventId]);

  const handleItemPress = (item: PersonsWishlistItemData) => {
    if (activeTab === 'wishlist') {
      navigation.navigate('GiftOptions', { item, eventTitle });
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
            // Reload list after delete
            if (resolvedEventId) {
              const [wishlist, nonWishlist] = await Promise.all([
                getWishlistByEventApi(resolvedEventId),
                getNonWishlistByEventApi(resolvedEventId),
              ]);
              setWishlistItems((wishlist?.items ?? []).map(mapWishlistItem));
              setNonWishlistItems((nonWishlist?.items ?? []).map(mapNonWishlistItem));
            }
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
      onPress={activeTab === 'wishlist' ? handleItemPress : undefined}
      showContributed={activeTab === 'wishlist'}
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
      <View style={styles.tabRow}>
        {renderTab('wishlist', 'Wishlist')}
        {renderTab('nonWishlist', 'Non Wishlist')}
      </View>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={{ padding: 16, color: '#666' }}>No items found.</Text>}
        />
      )}
    </View>
  );
};

export default PersonsWishlist;

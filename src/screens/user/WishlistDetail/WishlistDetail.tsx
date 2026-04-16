import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useRoute, useNavigation, RouteProp, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Tabs, WishlistDetailItem } from '../../../components';
import type { WishlistDetailItemData } from '../../../components/WishlistDetailItem';
import { getWishlistByEventApi } from '../../../api/wishlistApi';
import { getNonWishlistByEventApi } from '../../../api/nonWishlistApi';
import { styles } from './styles';

type WishlistDetailRouteProp = RouteProp<
  { params: { wishlistName?: string; eventId?: string } },
  'params'
>;

type EventsStackParamList = {
  WishlistDetail: { wishlistName?: string; eventId?: string };
  EditItem: { item: WishlistDetailItemData; categoryValue?: string | number };
};

type TabKey = 'wishlist' | 'nonWishlist';

const WishlistDetail = () => {
  const route = useRoute<WishlistDetailRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<EventsStackParamList, 'WishlistDetail'>>();
  const [activeTab, setActiveTab] = useState<TabKey>('wishlist');
  const [wishlistItems, setWishlistItems] = useState<WishlistDetailItemData[]>([]);
  const [nonWishlistItems, setNonWishlistItems] = useState<WishlistDetailItemData[]>([]);

  const loadItems = useCallback(async () => {
    if (!route.params?.eventId) {
      setWishlistItems([]);
      setNonWishlistItems([]);
      return;
    }
    try {
      const [wishlist, nonWishlist] = await Promise.all([
        getWishlistByEventApi(route.params.eventId),
        getNonWishlistByEventApi(route.params.eventId),
      ]);

      const mappedWishlist =
        wishlist?.items?.map((item) => ({
          id: item._id,
          title: item.title || 'Wishlist Item',
          price: `PKR ${item.price ?? 0}`,
          image: item.image || 'https://picsum.photos/seed/wishlist/400/200',
          // Backend uses `allowsContribution`
          statusText: item.allowsContribution ? 'Contribution Enabled' : 'Contribution Not Enabled',
          categoryValue: item.category,
        })) ?? [];

      const mappedNonWishlist =
        nonWishlist?.items?.map((item) => ({
          id: item._id,
          title: item.title || 'Non-wishlist Item',
          price: `PKR ${item.price ?? 0}`,
          image: item.image || 'https://picsum.photos/seed/nonwishlist/400/200',
          statusText: 'Non Wishlist Item',
          categoryValue: item.category,
        })) ?? [];

      setWishlistItems(mappedWishlist);
      setNonWishlistItems(mappedNonWishlist);
    } catch {
      setWishlistItems([]);
      setNonWishlistItems([]);
    }
  }, [route.params?.eventId]);

  // Load on mount and whenever eventId changes.
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Also reload when returning from Add/Edit screens.
  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [loadItems])
  );

  const renderItem = ({ item }: { item: WishlistDetailItemData }) => (
    <WishlistDetailItem
      item={item}
      onViewDetails={(_item) => {
        // TODO: Navigate to item detail when implemented
      }}
      onEdit={
        activeTab === 'wishlist'
          ? (i) => navigation.navigate('EditItem', { item: i })
          : undefined
      }
    />
  );

  const items = useMemo(
    () => (activeTab === 'wishlist' ? wishlistItems : nonWishlistItems),
    [activeTab, wishlistItems, nonWishlistItems]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Tabs<TabKey>
              value={activeTab}
              onChange={setActiveTab}
              options={[
                { value: 'wishlist', label: `Wishlist Items (${wishlistItems.length})` },
                { value: 'nonWishlist', label: `Non Wishlist Items (${nonWishlistItems.length})` },
              ]}
            />
            <Text style={styles.sectionTitle}>
              {activeTab === 'wishlist' ? 'Wishlist Items' : 'Non Wishlist Items'} ({items.length})
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default WishlistDetail;

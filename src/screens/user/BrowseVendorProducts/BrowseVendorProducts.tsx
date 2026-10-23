import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation, useFocusEffect, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getAllProductsApi, type ProductModel } from '../../../api/productApi';
import { getVendorsNearUserApi } from '../../../api/vendorApi';
import { getWishlistByEventApi, getWishlistByUserApi } from '../../../api/wishlistApi';
import { getNonWishlistByEventApi, getNonWishlistByUserApi } from '../../../api/nonWishlistApi';
import { useAuth } from '../../../context/AuthContext';
import { filterUnaddedCatalogProducts } from '../../../utils/filterAddedCatalogProducts';
import { colors } from '../../../theme';
import { getProductVendorName, resolveProductImageUri } from '../../../utils/resolveProductImage';
import { isProductOutOfStock } from '../../../utils/productStock';
import {
  availabilityLabel,
  isProductListedForCustomers,
  isProductPurchasable,
  normalizeAvailabilityStatus,
} from '../../../utils/productAvailability';
import { getHotProductIds, isHotProduct, sortProductsHotFirst } from '../../../utils/hotProduct';
import { styles } from './styles';

export type BrowseVendorProductsParams = {
  eventId?: string;
  userId?: string;
  listType?: 'wishlist' | 'nonWishlist';
  giftMode?: 'directGift';
  recipientUserId?: string;
  recipientName?: string;
  /** Limit catalog to vendors in this user's city (favorites / personal list). */
  cityOwnerUserId?: string;
};

type StackParamList = {
  BrowseVendorProducts: BrowseVendorProductsParams;
  VendorProductDetail: {
    product: ProductModel;
    eventId?: string;
    listType?: 'wishlist' | 'nonWishlist';
    giftMode?: 'directGift';
    recipientUserId?: string;
    recipientName?: string;
  };
};

type RouteProps = RouteProp<{ params: BrowseVendorProductsParams }, 'params'>;

type VendorProductSection = {
  title: string;
  data: ProductModel[];
};

function formatPkr(price: number | undefined): string {
  const n = typeof price === 'number' ? price : 0;
  return `PKR ${n.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function isFromApprovedVendor(product: ProductModel): boolean {
  const vendor = product.vendorId;
  if (!vendor || typeof vendor === 'string') return true;
  return vendor.isApproved !== false;
}

function getProductVendorId(product: ProductModel): string {
  const vendor = product.vendorId;
  if (!vendor) return '';
  return typeof vendor === 'object' ? String(vendor._id || '') : String(vendor);
}

function groupProductsByVendor(
  products: ProductModel[],
  hotIds: Set<string>,
): VendorProductSection[] {
  const byVendor = new Map<string, { title: string; data: ProductModel[] }>();

  for (const product of products) {
    const vendorId = getProductVendorId(product) || 'unknown';
    const title = getProductVendorName(product) || 'Other vendors';
    const existing = byVendor.get(vendorId);
    if (existing) {
      existing.data.push(product);
    } else {
      byVendor.set(vendorId, { title, data: [product] });
    }
  }

  return Array.from(byVendor.values())
    .map((section) => ({
      ...section,
      data: sortProductsHotFirst(section.data, hotIds),
    }))
    .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
}

const BrowseVendorProducts = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList, 'BrowseVendorProducts'>>();
  const { user } = useAuth();
  const eventId = route.params?.eventId;
  const listUserId = route.params?.userId ?? user?.id;
  const listType = route.params?.listType;
  const isDirectGift = route.params?.giftMode === 'directGift';
  const recipientUserId = route.params?.recipientUserId;
  const recipientName = route.params?.recipientName;
  const cityOwnerUserId =
    route.params?.cityOwnerUserId
    ?? (isDirectGift ? recipientUserId : (!eventId ? listUserId : undefined));

  const [products, setProducts] = useState<ProductModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [emptyHint, setEmptyHint] = useState<string | undefined>();

  const hotIds = useMemo(() => getHotProductIds(products), [products]);
  const sections = useMemo(
    () => groupProductsByVendor(products, hotIds),
    [products, hotIds],
  );

  const load = useCallback(async () => {
    setError('');
    setEmptyHint(undefined);
    setLoading(true);
    try {
      const [list, wishlist, nonWishlist, cityVendors] = await Promise.all([
        getAllProductsApi(),
        isDirectGift
          ? Promise.resolve(null)
          : eventId
            ? getWishlistByEventApi(eventId).catch(() => null)
            : listUserId
              ? getWishlistByUserApi(listUserId).catch(() => null)
              : Promise.resolve(null),
        isDirectGift
          ? Promise.resolve(null)
          : eventId
            ? getNonWishlistByEventApi(eventId).catch(() => null)
            : listUserId
              ? getNonWishlistByUserApi(listUserId).catch(() => null)
              : Promise.resolve(null),
        cityOwnerUserId
          ? getVendorsNearUserApi(cityOwnerUserId)
          : Promise.resolve(null),
      ]);

      const approved = list
        .filter(isFromApprovedVendor)
        .filter((p) => isProductListedForCustomers(p.availabilityStatus, p.inventory));
      let available = isDirectGift
        ? approved
        : filterUnaddedCatalogProducts(
            approved,
            wishlist?.items ?? [],
            nonWishlist?.items ?? [],
          );

      if (cityVendors) {
        if (!cityVendors.hasRecipientCity) {
          available = [];
          setEmptyHint(
            isDirectGift
              ? 'This person has not set their city yet. Ask them to update their profile.'
              : 'Set your city in your profile to see products from vendors in your city.',
          );
        } else {
          const vendorIdsInCity = new Set(
            cityVendors.vendors.map((vendor) => String(vendor._id)),
          );
          available = available.filter((product) =>
            vendorIdsInCity.has(getProductVendorId(product)),
          );
          if (available.length === 0) {
            const cityLabel = cityVendors.recipientCity
              ? ` in ${cityVendors.recipientCity}`
              : '';
            setEmptyHint(
              isDirectGift
                ? `No vendor products are available${cityLabel} for this gift yet.`
                : `No products from your city vendors${cityLabel} are available to add yet.`,
            );
          }
        }
      }

      setProducts(available);
    } catch (e) {
      setProducts([]);
      setError(e instanceof Error ? e.message : 'Could not load products');
    } finally {
      setLoading(false);
    }
  }, [eventId, listUserId, isDirectGift, recipientUserId, cityOwnerUserId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const handlePress = (product: ProductModel) => {
    navigation.navigate('VendorProductDetail', {
      product,
      eventId,
      listType,
      giftMode: isDirectGift ? 'directGift' : undefined,
      recipientUserId,
      recipientName,
    });
  };

  const renderItem = ({ item }: { item: ProductModel }) => {
    const imageUri = resolveProductImageUri(item);
    const vendorName = getProductVendorName(item);
    const purchasable = isProductPurchasable(item.availabilityStatus, item.inventory);
    const statusLabel = availabilityLabel(
      normalizeAvailabilityStatus(item.availabilityStatus, item.inventory),
    );
    const showUnavailable = !purchasable;
    const hot = isHotProduct(item, hotIds);

    return (
      <TouchableOpacity
        style={[
          styles.card,
          showUnavailable ? styles.cardOutOfStock : null,
          hot ? styles.cardHot : null,
        ]}
        activeOpacity={0.85}
        onPress={() => handlePress(item)}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="inventory-2" size={28} color={colors.darkGray} />
          </View>
        )}
        <View style={styles.content}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, hot ? styles.nameHot : null]} numberOfLines={2}>
              {item.name}
            </Text>
            {hot ? (
              <View style={styles.hotBadge}>
                <Icon name="local-fire-department" size={12} color={colors.white} />
                <Text style={styles.hotBadgeText}>Hot Product</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.price}>{formatPkr(item.price)}</Text>
          {vendorName ? (
            <View style={styles.vendorRow}>
              <Icon name="storefront" size={14} color={colors.darkGray} />
              <Text style={styles.vendor} numberOfLines={1}>
                {vendorName}
              </Text>
            </View>
          ) : null}
          {showUnavailable ? (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>
                {isProductOutOfStock(item.inventory) ? 'Out of Stock' : statusLabel}
              </Text>
            </View>
          ) : null}
        </View>
        <Icon name="chevron-right" size={24} color={colors.darkGray} />
      </TouchableOpacity>
    );
  };

  if (isDirectGift && !recipientUserId) {
    return (
      <View style={styles.centered}>
        <Text style={styles.hint}>Recipient is missing. Go back and try again.</Text>
      </View>
    );
  }

  if (!isDirectGift && !eventId && !listUserId) {
    return (
      <View style={styles.centered}>
        <Text style={styles.hint}>Could not load your wishlist. Go back and try again.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={
          products.length === 0 ? [styles.listContent, styles.centered] : styles.listContent
        }
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Icon name="store" size={18} color={colors.primary} />
            <Text style={styles.sectionHeaderText}>{section.title}</Text>
            <Text style={styles.sectionCount}>
              {section.data.length} {section.data.length === 1 ? 'product' : 'products'}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.hint}>
            {error
              || emptyHint
              || (isDirectGift
                ? 'No vendor products available yet.'
                : 'No more products to add. Every catalog item is already on your wishlist or non-wishlist.')}
          </Text>
        }
      />
    </View>
  );
};

export default BrowseVendorProducts;

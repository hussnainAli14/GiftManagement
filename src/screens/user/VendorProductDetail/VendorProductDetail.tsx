import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from '../../../components';
import type { ProductModel } from '../../../api/productApi';
import { getVendorProductsApi } from '../../../api/productApi';
import { addWishlistItemApi } from '../../../api/wishlistApi';
import { addNonWishlistItemApi } from '../../../api/nonWishlistApi';
import { getProductReviewsApi, type ProductReviewsSummary } from '../../../api/reviewApi';
import { colors } from '../../../theme';
import { getProductVendorName, resolveProductImageUri } from '../../../utils/resolveProductImage';
import { isProductOutOfStock } from '../../../utils/productStock';
import {
  availabilityLabel,
  isProductPurchasable,
  normalizeAvailabilityStatus,
} from '../../../utils/productAvailability';
import { getHotProductIds, isHotProduct } from '../../../utils/hotProduct';
import type { VendorItem } from '../SelectVendor/types';
import { styles } from './styles';

export type VendorProductDetailParams = {
  product: ProductModel;
  eventId?: string;
  listType?: 'wishlist' | 'nonWishlist';
  giftMode?: 'directGift';
  recipientUserId?: string;
  recipientName?: string;
};

type StackParamList = {
  VendorProductDetail: VendorProductDetailParams;
  ConfirmOrder: {
    item: {
      id: string;
      title: string;
      description: string;
      price: string;
      image: string;
      contributedPercent: number;
    };
    vendor: VendorItem;
    eventTitle?: string;
    directGift?: boolean;
    productId?: string;
    recipientUserId?: string;
    recipientName?: string;
  };
};

type RouteProps = RouteProp<{ params: VendorProductDetailParams }, 'params'>;

function formatPkr(price: number | undefined): string {
  const n = typeof price === 'number' ? price : 0;
  return `PKR ${n.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function resolveVendorId(product: ProductModel): string {
  const vendor = product.vendorId;
  if (!vendor) return '';
  return typeof vendor === 'object' ? String(vendor._id) : String(vendor);
}

const VendorProductDetail = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList, 'VendorProductDetail'>>();
  const { product, eventId, listType, giftMode, recipientUserId, recipientName } = route.params ?? {};
  const [adding, setAdding] = useState<'wishlist' | 'nonWishlist' | null>(null);
  const [reviewsSummary, setReviewsSummary] = useState<ProductReviewsSummary | null>(null);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [isHot, setIsHot] = useState(false);
  const targetListType = listType ?? 'wishlist';
  const isDirectGift = giftMode === 'directGift';

  useEffect(() => {
    if (!product?._id) return;
    let cancelled = false;
    (async () => {
      setLoadingReviews(true);
      try {
        const data = await getProductReviewsApi(product._id);
        if (!cancelled) setReviewsSummary(data);
      } catch {
        if (!cancelled) setReviewsSummary(null);
      } finally {
        if (!cancelled) setLoadingReviews(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [product?._id]);

  useEffect(() => {
    if (!product?._id) {
      setIsHot(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const vendorId = resolveVendorId(product);
        if (!vendorId) {
          const alone = getHotProductIds([product]);
          if (!cancelled) setIsHot(isHotProduct(product, alone));
          return;
        }
        const siblings = await getVendorProductsApi(vendorId);
        const hotIds = getHotProductIds(siblings.length ? siblings : [product]);
        if (!cancelled) setIsHot(isHotProduct(product, hotIds));
      } catch {
        const alone = getHotProductIds([product]);
        if (!cancelled) setIsHot(isHotProduct(product, alone));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [product]);

  const imageUri = useMemo(
    () => (product ? resolveProductImageUri(product) : undefined),
    [product],
  );
  const vendorName = product ? getProductVendorName(product) : undefined;
  const availability = product
    ? normalizeAvailabilityStatus(product.availabilityStatus, product.inventory)
    : 'active';
  const outOfStock = product
    ? !isProductPurchasable(product.availabilityStatus, product.inventory)
    : false;
  const availabilityText =
    availability === 'active' && isProductOutOfStock(product?.inventory)
      ? 'Out of Stock'
      : availabilityLabel(availability);

  const addToList = async (listType: 'wishlist' | 'nonWishlist') => {
    if (!product) {
      Alert.alert('Missing info', 'Could not add this product.');
      return;
    }
    if (outOfStock) {
      Alert.alert('Out of stock', 'This product is currently out of stock and cannot be added.');
      return;
    }

    setAdding(listType);
    try {
      const payload = {
        eventId,
        title: product.name,
        price: Number(product.price) || 0,
        category: product.category,
        image: imageUri,
        productId: product._id,
        vendorId: resolveVendorId(product) || undefined,
        vendorName: getProductVendorName(product),
      };

      if (listType === 'nonWishlist') {
        await addNonWishlistItemApi(payload);
        Alert.alert(
          'Added',
          vendorName
            ? `${product.name} from ${vendorName} was added to your non-wishlist.`
            : `${product.name} was added to your non-wishlist.`,
          [{ text: 'OK', onPress: () => navigation.pop(2) }],
        );
      } else {
        await addWishlistItemApi({ ...payload, isContributable: true });
        Alert.alert(
          'Added',
          vendorName
            ? `${product.name} from ${vendorName} was added to your wishlist.`
            : `${product.name} was added to your wishlist.`,
          [{ text: 'OK', onPress: () => navigation.pop(2) }],
        );
      }
    } catch (e) {
      Alert.alert('Could not add item', e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setAdding(null);
    }
  };

  const sendDirectGift = () => {
    if (!product || !recipientUserId) {
      Alert.alert('Missing info', 'Could not send this gift.');
      return;
    }
    if (outOfStock) {
      Alert.alert('Out of stock', 'This product is currently out of stock and cannot be gifted.');
      return;
    }

    const vendorId = resolveVendorId(product);
    const vendor: VendorItem = {
      id: vendorId,
      name: vendorName || 'Vendor',
      image: `https://picsum.photos/seed/vendor-${vendorId || product._id}/200/200`,
      rating: 0,
      locationLabel: '',
    };

    navigation.navigate('ConfirmOrder', {
      item: {
        id: product._id,
        title: product.name,
        description: product.description?.trim() || '',
        price: formatPkr(product.price),
        image: imageUri || `https://picsum.photos/seed/product-${product._id}/400/300`,
        contributedPercent: 0,
      },
      vendor,
      eventTitle: recipientName ? `Gift for ${recipientName}` : 'Direct Gift',
      directGift: true,
      productId: product._id,
      recipientUserId,
      recipientName,
    });
  };

  if (!product) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={styles.description}>Product not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.heroImage} resizeMode="cover" />
        ) : (
          <View style={styles.heroPlaceholder}>
            <Icon name="inventory-2" size={48} color={colors.darkGray} />
          </View>
        )}

        <View style={styles.body}>
          <Text style={styles.name}>{product.name}</Text>
          {isHot ? (
            <View style={styles.hotBadge}>
              <Icon name="local-fire-department" size={14} color={colors.white} />
              <Text style={styles.hotBadgeText}>Hot Product</Text>
            </View>
          ) : null}
          <Text style={styles.price}>{formatPkr(product.price)}</Text>
          {loadingReviews ? (
            <ActivityIndicator color={colors.primary} style={styles.ratingLoader} />
          ) : reviewsSummary && reviewsSummary.reviewCount > 0 ? (
            <View style={styles.ratingRow}>
              <Icon name="star" size={18} color={colors.primary} />
              <Text style={styles.ratingText}>
                {reviewsSummary.averageRating?.toFixed(1)} ({reviewsSummary.reviewCount}{' '}
                {reviewsSummary.reviewCount === 1 ? 'review' : 'reviews'})
              </Text>
            </View>
          ) : (
            <Text style={styles.noReviews}>No ratings yet</Text>
          )}
          {outOfStock ? (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>{availabilityText}</Text>
            </View>
          ) : null}
          {vendorName ? <Text style={styles.vendor}>Sold by {vendorName}</Text> : null}
          {product.description?.trim() ? (
            <Text style={styles.description}>{product.description.trim()}</Text>
          ) : null}

          {reviewsSummary && reviewsSummary.reviews.length > 0 ? (
            <View style={styles.reviewsSection}>
              <Text style={styles.sectionLabel}>Customer reviews</Text>
              {reviewsSummary.reviews.slice(0, 3).map((r) => (
                <View key={String(r._id)} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewerName}>{r.userName || 'Customer'}</Text>
                    <View style={styles.reviewStars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Icon
                          key={star}
                          name={star <= r.rating ? 'star' : 'star-border'}
                          size={14}
                          color={star <= r.rating ? colors.primary : colors.darkGray}
                        />
                      ))}
                    </View>
                  </View>
                  {r.comment ? <Text style={styles.reviewComment}>{r.comment}</Text> : null}
                </View>
              ))}
            </View>
          ) : null}

          {isDirectGift ? (
            <>
              <Text style={styles.sectionLabel}>
                {outOfStock
                  ? 'This product is out of stock'
                  : recipientName
                    ? `Send this gift to ${recipientName}`
                    : 'Send this gift'}
              </Text>
              <View style={styles.actions}>
                <Button
                  variant="primary"
                  fullWidth
                  onPress={sendDirectGift}
                  disabled={outOfStock}
                >
                  Continue to Order
                </Button>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.sectionLabel}>
                {outOfStock
                  ? 'This product is out of stock'
                  : targetListType === 'nonWishlist'
                    ? 'Add to non-wishlist'
                    : 'Add to your event'}
              </Text>
              <View style={styles.actions}>
                {(listType == null || listType === 'wishlist') ? (
                  <Button
                    variant="primary"
                    fullWidth
                    onPress={() => addToList('wishlist')}
                    disabled={adding != null || outOfStock}
                  >
                    {adding === 'wishlist' ? 'Adding…' : 'Add to Wishlist'}
                  </Button>
                ) : null}
                {(listType == null || listType === 'nonWishlist') ? (
                  <Button
                    variant={listType === 'nonWishlist' ? 'primary' : 'secondary'}
                    fullWidth
                    onPress={() => addToList('nonWishlist')}
                    disabled={adding != null || outOfStock}
                  >
                    {adding === 'nonWishlist' ? 'Adding…' : 'Add to Non Wishlist'}
                  </Button>
                ) : null}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default VendorProductDetail;

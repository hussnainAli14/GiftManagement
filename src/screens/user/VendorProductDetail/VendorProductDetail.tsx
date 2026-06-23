import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Image, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from '../../../components';
import type { ProductModel } from '../../../api/productApi';
import { addWishlistItemApi } from '../../../api/wishlistApi';
import { addNonWishlistItemApi } from '../../../api/nonWishlistApi';
import { colors } from '../../../theme';
import { getProductVendorName, resolveProductImageUri } from '../../../utils/resolveProductImage';
import { styles } from './styles';

export type VendorProductDetailParams = {
  product: ProductModel;
  eventId: string;
  listType?: 'wishlist' | 'nonWishlist';
};

type StackParamList = {
  VendorProductDetail: VendorProductDetailParams;
};

type RouteProps = RouteProp<{ params: VendorProductDetailParams }, 'params'>;

function formatPkr(price: number | undefined): string {
  const n = typeof price === 'number' ? price : 0;
  return `PKR ${n.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

const VendorProductDetail = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList, 'VendorProductDetail'>>();
  const { product, eventId, listType } = route.params ?? {};
  const [adding, setAdding] = useState<'wishlist' | 'nonWishlist' | null>(null);
  const targetListType = listType ?? 'wishlist';

  const imageUri = useMemo(
    () => (product ? resolveProductImageUri(product) : undefined),
    [product],
  );
  const vendorName = product ? getProductVendorName(product) : undefined;

  const addToList = async (listType: 'wishlist' | 'nonWishlist') => {
    if (!product || !eventId) {
      Alert.alert('Missing info', 'Could not add this product.');
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
      };

      if (listType === 'nonWishlist') {
        await addNonWishlistItemApi(payload);
        Alert.alert('Added', `${product.name} was added to your non-wishlist.`, [
          { text: 'OK', onPress: () => navigation.pop(2) },
        ]);
      } else {
        await addWishlistItemApi({ ...payload, isContributable: true });
        Alert.alert('Added', `${product.name} was added to your wishlist.`, [
          { text: 'OK', onPress: () => navigation.pop(2) },
        ]);
      }
    } catch (e) {
      Alert.alert('Could not add item', e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setAdding(null);
    }
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
          <Text style={styles.price}>{formatPkr(product.price)}</Text>
          {vendorName ? <Text style={styles.vendor}>Sold by {vendorName}</Text> : null}
          {product.description?.trim() ? (
            <Text style={styles.description}>{product.description.trim()}</Text>
          ) : null}

          <Text style={styles.sectionLabel}>
            {targetListType === 'nonWishlist' ? 'Add to non-wishlist' : 'Add to your event'}
          </Text>
          <View style={styles.actions}>
            {(listType == null || listType === 'wishlist') ? (
              <Button
                variant="primary"
                fullWidth
                onPress={() => addToList('wishlist')}
                disabled={adding != null}
              >
                {adding === 'wishlist' ? 'Adding…' : 'Add to Wishlist'}
              </Button>
            ) : null}
            {(listType == null || listType === 'nonWishlist') ? (
              <Button
                variant={listType === 'nonWishlist' ? 'primary' : 'secondary'}
                fullWidth
                onPress={() => addToList('nonWishlist')}
                disabled={adding != null}
              >
                {adding === 'nonWishlist' ? 'Adding…' : 'Add to Non Wishlist'}
              </Button>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default VendorProductDetail;

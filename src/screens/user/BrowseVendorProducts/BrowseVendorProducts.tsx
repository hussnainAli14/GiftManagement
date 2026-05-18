import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation, useFocusEffect, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getAllProductsApi, type ProductModel } from '../../../api/productApi';
import { colors } from '../../../theme';
import { getProductVendorName, resolveProductImageUri } from '../../../utils/resolveProductImage';
import { styles } from './styles';

export type BrowseVendorProductsParams = {
  eventId: string;
};

type StackParamList = {
  BrowseVendorProducts: BrowseVendorProductsParams;
  VendorProductDetail: {
    product: ProductModel;
    eventId: string;
  };
};

type RouteProps = RouteProp<{ params: BrowseVendorProductsParams }, 'params'>;

function formatPkr(price: number | undefined): string {
  const n = typeof price === 'number' ? price : 0;
  return `PKR ${n.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function isFromApprovedVendor(product: ProductModel): boolean {
  const vendor = product.vendorId;
  if (!vendor || typeof vendor === 'string') return true;
  return vendor.isApproved !== false;
}

const BrowseVendorProducts = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList, 'BrowseVendorProducts'>>();
  const eventId = route.params?.eventId ?? '';

  const [products, setProducts] = useState<ProductModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const list = await getAllProductsApi();
      setProducts(list.filter(isFromApprovedVendor));
    } catch (e) {
      setProducts([]);
      setError(e instanceof Error ? e.message : 'Could not load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const handlePress = (product: ProductModel) => {
    if (!eventId) return;
    navigation.navigate('VendorProductDetail', { product, eventId });
  };

  const renderItem = ({ item }: { item: ProductModel }) => {
    const imageUri = resolveProductImageUri(item);
    const vendorName = getProductVendorName(item);

    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => handlePress(item)}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="inventory-2" size={28} color={colors.darkGray} />
          </View>
        )}
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.price}>{formatPkr(item.price)}</Text>
          {vendorName ? (
            <Text style={styles.vendor} numberOfLines={1}>
              {vendorName}
            </Text>
          ) : null}
        </View>
        <Icon name="chevron-right" size={24} color={colors.darkGray} />
      </TouchableOpacity>
    );
  };

  if (!eventId) {
    return (
      <View style={styles.centered}>
        <Text style={styles.hint}>Event is missing. Go back and try again.</Text>
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
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={
          products.length === 0 ? [styles.listContent, styles.centered] : styles.listContent
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.hint}>
            {error || 'No vendor products available yet. Check back later.'}
          </Text>
        }
      />
    </View>
  );
};

export default BrowseVendorProducts;

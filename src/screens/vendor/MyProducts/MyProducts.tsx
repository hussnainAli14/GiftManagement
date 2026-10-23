import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Modal, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../../theme';
import { styles } from './styles';
import { getMyVendorProfileApi } from '../../../api/vendorApi';
import { deleteProductApi, getVendorProductsApi, updateProductApi, type ProductModel } from '../../../api/productApi';
import { stockStatusFromInventory, type StockStatus } from '../../../utils/productStock';
import {
  availabilityLabel,
  normalizeAvailabilityStatus,
  type ProductAvailabilityStatus,
} from '../../../utils/productAvailability';
import { getHotProductIds, sortProductsHotFirst } from '../../../utils/hotProduct';
import { API_ORIGIN } from '../../../api/config';

type MyProductsStackParamList = {
  MyProducts: undefined;
  EditProduct: { product: VendorProductItem };
};

export type { StockStatus };

export type VendorProductItem = {
  id: string;
  name: string;
  price: string;
  stockStatus: StockStatus;
  availabilityStatus: ProductAvailabilityStatus;
  imageUri?: string | number;
  isHot?: boolean;
  salesCount?: number;
};

function formatPrice(price: number | undefined): string {
  const n = typeof price === 'number' ? price : 0;
  return `Rs ${n.toFixed(2)}`;
}

function toVendorProductItem(p: ProductModel, hotIds: Set<string>): VendorProductItem {
  const raw = (p.image || '').trim();
  const imageUri = raw ? (raw.startsWith('/') ? `${API_ORIGIN}${raw}` : raw) : undefined;
  const availabilityStatus = normalizeAvailabilityStatus(p.availabilityStatus, p.inventory);
  return {
    id: String(p._id),
    name: p.name || 'Product',
    price: formatPrice(p.price),
    stockStatus: stockStatusFromInventory(p.inventory),
    availabilityStatus,
    imageUri,
    isHot: hotIds.has(String(p._id)),
    salesCount: Number(p.salesCount) || 0,
  };
}

const MyProducts = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<MyProductsStackParamList, 'MyProducts'>>();
  const listPaddingBottom = insets.bottom + 80;
  const [products, setProducts] = useState<VendorProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>('');
  const [productToDelete, setProductToDelete] = useState<VendorProductItem | null>(null);

  const load = useCallback(async () => {
    setError('');
    try {
      const vendor = await getMyVendorProfileApi();
      const vendorId = String(vendor?._id || '');
      if (!vendorId) throw new Error('Vendor profile not found');
      const rows = await getVendorProductsApi(vendorId);
      const hotIds = getHotProductIds(rows);
      const sorted = sortProductsHotFirst(rows, hotIds);
      setProducts(sorted.map((row) => toVendorProductItem(row, hotIds)));
    } catch (e) {
      setProducts([]);
      setError(e instanceof Error ? e.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const renderAvailabilityStatus = (status: ProductAvailabilityStatus) => {
    const label = availabilityLabel(status);
    if (status === 'out_of_stock' || status === 'discontinued') {
      return <Text style={styles.stockOutOfStock}>{label}</Text>;
    }
    if (status === 'inactive') {
      return <Text style={styles.stockLowStock}>{label}</Text>;
    }
    return <Text style={styles.stockInStock}>{label}</Text>;
  };

  const handleQuickStatus = (item: VendorProductItem) => {
    Alert.alert('Availability', `Set status for "${item.name}"`, [
      {
        text: 'Active',
        onPress: () => changeStatus(item, 'active'),
      },
      {
        text: 'Inactive',
        onPress: () => changeStatus(item, 'inactive'),
      },
      {
        text: 'Out of Stock',
        onPress: () => changeStatus(item, 'out_of_stock'),
      },
      {
        text: 'Discontinued',
        onPress: () => changeStatus(item, 'discontinued'),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const changeStatus = async (item: VendorProductItem, status: ProductAvailabilityStatus) => {
    try {
      await updateProductApi(item.id, { availabilityStatus: status });
      setProducts((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, availabilityStatus: status } : p)),
      );
    } catch (e) {
      Alert.alert('Could not update status', e instanceof Error ? e.message : 'Please try again.');
    }
  };

  const renderStockStatus = (status: StockStatus) => {
    if (status === 'Out of Stock') {
      return <Text style={styles.stockOutOfStock}>{status}</Text>;
    }
    if (status === 'Low Stock') {
      return <Text style={styles.stockLowStock}>{status}</Text>;
    }
    return <Text style={styles.stockInStock}>{status}</Text>;
  };

  const handleEdit = (item: VendorProductItem) => {
    navigation.navigate('EditProduct', { product: item });
  };

  const handleDeletePress = (item: VendorProductItem) => {
    setProductToDelete(item);
  };

  const handleDeleteCancel = () => {
    setProductToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    const id = productToDelete.id;
    setProductToDelete(null);
    try {
      await deleteProductApi(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      Alert.alert('Could not delete product', e instanceof Error ? e.message : 'Please try again.');
    }
  };

  const listEmpty = useMemo(() => {
    if (loading) return null;
    if (error) {
      return (
        <View style={{ paddingTop: 20, alignItems: 'center' }}>
          <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>{error}</Text>
          <Text style={{ color: colors.primary, marginTop: 8 }}>Pull to refresh</Text>
        </View>
      );
    }
    return (
      <View style={{ paddingTop: 20, alignItems: 'center' }}>
        <Text style={{ color: colors.textSecondary }}>No products yet</Text>
      </View>
    );
  }, [error, loading]);

  const renderProductCard = ({ item }: { item: VendorProductItem }) => (
    <View style={[styles.card, item.isHot ? styles.cardHot : null]}>
      <View style={styles.productImage}>
        {item.imageUri ? (
          <Image
            source={typeof item.imageUri === 'string' ? { uri: item.imageUri } : (item.imageUri as any)}
            style={styles.productImageFill}
            resizeMode="cover"
          />
        ) : (
          <Icon name="inventory-2" size={48} color={colors.darkGray} />
        )}
        {item.isHot ? (
          <View style={styles.hotBadgeOverlay}>
            <Icon name="local-fire-department" size={14} color={colors.white} />
            <Text style={styles.hotBadgeText}>Hot Product</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.cardBody}>
        <View style={styles.namePriceRow}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.productPrice}>{item.price}</Text>
        </View>
        {item.isHot ? (
          <Text style={styles.hotSalesHint}>
            Top seller · {item.salesCount || 0} sold
          </Text>
        ) : null}
        <TouchableOpacity onPress={() => handleQuickStatus(item)} activeOpacity={0.7}>
          {renderAvailabilityStatus(item.availabilityStatus)}
        </TouchableOpacity>
        {item.availabilityStatus === 'active' ? renderStockStatus(item.stockStatus) : null}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEdit(item)}
            activeOpacity={0.7}
          >
            <Icon name="edit" size={18} color={colors.textSecondary} />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeletePress(item)}
            activeOpacity={0.7}
          >
            <Icon name="delete" size={18} color={colors.white} />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProductCard}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: listPaddingBottom },
            products.length === 0 ? { flexGrow: 1 } : null,
          ]}
          ListEmptyComponent={listEmpty}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      <Modal
        visible={productToDelete !== null}
        transparent
        animationType="fade"
        onRequestClose={handleDeleteCancel}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleDeleteCancel}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>
              Are you sure you want to delete this product?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={handleDeleteCancel}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleDeleteConfirm}
                activeOpacity={0.7}
              >
                <Text style={styles.modalConfirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default MyProducts;

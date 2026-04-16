import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Modal, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../../theme';
import { styles } from './styles';
import { getMyVendorProfileApi } from '../../../api/vendorApi';
import { deleteProductApi, getVendorProductsApi, type ProductModel } from '../../../api/productApi';
import { API_ORIGIN } from '../../../api/config';

type MyProductsStackParamList = {
  MyProducts: undefined;
  EditProduct: { product: VendorProductItem };
};

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export type VendorProductItem = {
  id: string;
  name: string;
  price: string;
  stockStatus: StockStatus;
  imageUri?: string | number;
};

function formatPrice(price: number | undefined): string {
  const n = typeof price === 'number' ? price : 0;
  return `Rs ${n.toFixed(2)}`;
}

function stockStatusFromInventory(inv: number | undefined): StockStatus {
  const n = typeof inv === 'number' ? inv : 0;
  if (n <= 0) return 'Out of Stock';
  if (n <= 5) return 'Low Stock';
  return 'In Stock';
}

function toVendorProductItem(p: ProductModel): VendorProductItem {
  const raw = (p.image || '').trim();
  const imageUri = raw ? (raw.startsWith('/') ? `${API_ORIGIN}${raw}` : raw) : undefined;
  return {
    id: String(p._id),
    name: p.name || 'Product',
    price: formatPrice(p.price),
    stockStatus: stockStatusFromInventory(p.inventory),
    imageUri,
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
      setProducts(rows.map(toVendorProductItem));
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
    <View style={styles.card}>
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
      </View>
      <View style={styles.cardBody}>
        <View style={styles.namePriceRow}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.productPrice}>{item.price}</Text>
        </View>
        {renderStockStatus(item.stockStatus)}
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

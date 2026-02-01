import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../../theme';
import { styles } from './styles';

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

const MOCK_PRODUCTS: VendorProductItem[] = [
  { id: '1', name: 'Artisanal Organic Honey (500g)', price: 'Rs 18.00', stockStatus: 'In Stock', imageUri: 'https://picsum.photos/seed/honey/400/300' },
  { id: '2', name: 'Handcrafted Ceramic Mug', price: 'Rs 25.50', stockStatus: 'Low Stock', imageUri: 'https://picsum.photos/seed/ceramic-mug/400/300' },
  { id: '3', name: 'Natural Soy Wax Candle (Lavender)', price: 'Rs 12.99', stockStatus: 'Out of Stock', imageUri: 'https://picsum.photos/seed/candle/400/300' },
  { id: '4', name: 'Gourmet Coffee Beans (250g)', price: 'Rs 32.00', stockStatus: 'In Stock', imageUri: 'https://picsum.photos/seed/coffee-beans/400/300' },
  { id: '5', name: 'Organic Cotton Tea Towels (Set of 2)', price: 'Rs 15.00', stockStatus: 'In Stock', imageUri: 'https://picsum.photos/seed/tea-towels/400/300' },
];

const MyProducts = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<MyProductsStackParamList, 'MyProducts'>>();
  const listPaddingBottom = insets.bottom + 80;
  const [products, setProducts] = useState<VendorProductItem[]>(MOCK_PRODUCTS);
  const [productToDelete, setProductToDelete] = useState<VendorProductItem | null>(null);

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

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setProductToDelete(null);
    }
  };

  const renderProductCard = ({ item }: { item: VendorProductItem }) => (
    <View style={styles.card}>
      <View style={styles.productImage}>
        {item.imageUri ? (
          <Image
            source={{ uri: typeof item.imageUri === 'string' ? item.imageUri : undefined }}
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
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProductCard}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: listPaddingBottom },
        ]}
        showsVerticalScrollIndicator={false}
      />

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

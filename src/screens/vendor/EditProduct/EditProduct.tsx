import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TextInput, Dropdown } from '../../../components';
import { colors } from '../../../theme';
import type { VendorProductItem } from '../MyProducts/MyProducts';
import { styles } from './styles';

type EditProductParams = {
  product: VendorProductItem;
};

type DashboardStackParamList = {
  DashboardMain: undefined;
  AddProduct: undefined;
  MyProducts: undefined;
  EditProduct: EditProductParams;
};

const CATEGORY_OPTIONS = [
  { label: 'Electronics', value: 'electronics' },
  { label: 'Home & Kitchen', value: 'home_kitchen' },
  { label: 'Food & Beverage', value: 'food_beverage' },
  { label: 'Health & Beauty', value: 'health_beauty' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Other', value: 'other' },
];

const DEFAULT_DESCRIPTION = 'Carefully carved from sustainable oak, this spoon is perfect for cooking and serving. Each piece is unique, reflecting artisanal quality.';

function parsePriceFromProduct(priceStr: string): string {
  const match = priceStr.replace(/,/g, '').match(/[\d.]+/);
  return match ? match[0] : '0.00';
}

const EditProduct = () => {
  const route = useRoute<RouteProp<DashboardStackParamList, 'EditProduct'>>();
  const navigation = useNavigation<NativeStackNavigationProp<DashboardStackParamList, 'EditProduct'>>();
  const insets = useSafeAreaInsets();
  const { product } = route.params ?? {};

  const initialValues = useMemo(() => {
    if (!product) return null;
    return {
      productName: product.name,
      description: DEFAULT_DESCRIPTION,
      price: parsePriceFromProduct(product.price),
      inventory: '75',
      category: 'home_kitchen' as string | number,
      imageUri: typeof product.imageUri === 'string' ? product.imageUri : undefined,
    };
  }, [product]);

  const [productName, setProductName] = useState(initialValues?.productName ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [price, setPrice] = useState(initialValues?.price ?? '0.00');
  const [inventory, setInventory] = useState(initialValues?.inventory ?? '0');
  const [category, setCategory] = useState<string | number | null>(initialValues?.category ?? null);
  const [imageUri, setImageUri] = useState<string | undefined>(initialValues?.imageUri);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={{ padding: 16 }}>Product not found.</Text>
      </View>
    );
  }

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSaveChanges = () => {
    // TODO: validate and submit to API
    navigation.goBack();
  };

  const handleChangePhoto = () => {
    // TODO: open image picker
  };

  const productImageUri = imageUri ?? (typeof product.imageUri === 'string' ? product.imageUri : undefined);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Product Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Product Details</Text>
          <View style={styles.inputContainer}>
            <TextInput
              label="Product Name"
              placeholder="Enter product name"
              value={productName}
              onChangeText={setProductName}
              containerStyle={styles.inputContainerLast}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              label="Description"
              placeholder="Provide a detailed description."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              containerStyle={styles.inputContainerLast}
            />
          </View>
        </View>

        {/* Pricing & Inventory */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Pricing & Inventory</Text>
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <TextInput
                label="Price (USD)"
                placeholder="0.00"
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                containerStyle={{ marginBottom: 0 }}
              />
            </View>
            <View style={styles.halfInput}>
              <TextInput
                label="Inventory"
                placeholder="0"
                value={inventory}
                onChangeText={setInventory}
                keyboardType="number-pad"
                containerStyle={{ marginBottom: 0 }}
              />
            </View>
          </View>
        </View>

        {/* Product Media */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Product Media</Text>
          <View style={styles.mediaPreview}>
            {productImageUri ? (
              <Image
                source={{ uri: productImageUri }}
                style={styles.mediaImage}
                resizeMode="cover"
              />
            ) : (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="add-photo-alternate" size={48} color={colors.darkGray} />
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.changePhotoButton}
            onPress={handleChangePhoto}
            activeOpacity={0.7}
          >
            <Icon name="add-photo-alternate" size={20} color={colors.textSecondary} />
            <Text style={styles.changePhotoButtonText}>Change Product Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Category */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Category</Text>
          <Dropdown
            label="Category"
            placeholder="Select a category"
            value={category}
            onChange={(v) => setCategory(v)}
            data={CATEGORY_OPTIONS}
            containerStyle={{ marginBottom: 0 }}
          />
        </View>
        <View style={[styles.footer]}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveChanges}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>

      
    </View>
  );
};

export default EditProduct;

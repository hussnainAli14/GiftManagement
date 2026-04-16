import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { TextInput, Dropdown } from '../../../components';
import { colors } from '../../../theme';
import type { VendorProductItem } from '../MyProducts/MyProducts';
import { styles } from './styles';
import {
  addProductImageApi,
  deleteProductImageAtApi,
  getProductByIdApi,
  replaceProductImageAtApi,
  updateProductApi,
  type ProductModel,
} from '../../../api/productApi';
import { API_ORIGIN } from '../../../api/config';

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

function parsePriceFromProduct(priceStr: string): string {
  const match = priceStr.replace(/,/g, '').match(/[\d.]+/);
  return match ? match[0] : '0.00';
}

function resolveImageUri(raw: string | undefined): string | undefined {
  const s = (raw || '').trim();
  if (!s) return undefined;
  if (s.startsWith('/')) return `${API_ORIGIN}${s}`;
  return s;
}

const EditProduct = () => {
  const route = useRoute<RouteProp<DashboardStackParamList, 'EditProduct'>>();
  const navigation = useNavigation<NativeStackNavigationProp<DashboardStackParamList, 'EditProduct'>>();
  const insets = useSafeAreaInsets();
  const { product } = route.params ?? {};
  const productId = String(product?.id || '');
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState<ProductModel | null>(null);
  const [imageSaving, setImageSaving] = useState(false);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!productId) return;
      setLoading(true);
      try {
        const p = await getProductByIdApi(productId);
        if (!cancelled) setLoaded(p);
      } catch (e) {
        if (!cancelled) {
          setLoaded(null);
          Alert.alert('Could not load product', e instanceof Error ? e.message : 'Please try again.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const initialValues = useMemo(() => {
    if (!product) return null;
    return {
      productName: product.name,
      description: '',
      price: parsePriceFromProduct(product.price),
      inventory: '0',
      category: null as string | number | null,
      imageUri: typeof product.imageUri === 'string' ? product.imageUri : undefined,
    };
  }, [product]);

  const [productName, setProductName] = useState(initialValues?.productName ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [price, setPrice] = useState(initialValues?.price ?? '0.00');
  const [inventory, setInventory] = useState(initialValues?.inventory ?? '0');
  const [category, setCategory] = useState<string | number | null>(initialValues?.category ?? null);
  const [imageUri, setImageUri] = useState<string | undefined>(initialValues?.imageUri);

  useEffect(() => {
    if (!loaded) return;
    setProductName(loaded.name || '');
    setDescription(loaded.description || '');
    setPrice(typeof loaded.price === 'number' ? loaded.price.toFixed(2) : '0.00');
    setInventory(typeof loaded.inventory === 'number' ? String(loaded.inventory) : '0');
    setCategory(loaded.category || null);
    const nextImagesRaw = (loaded.images && Array.isArray(loaded.images) ? loaded.images : []).filter(Boolean);
    const fallback = loaded.image ? [loaded.image] : [];
    const nextImagesResolved = (nextImagesRaw.length ? nextImagesRaw : fallback)
      .map((s) => resolveImageUri(String(s))!)
      .filter(Boolean);
    setImages(nextImagesResolved);
    setSelectedImageIndex((prev) => (nextImagesResolved.length ? Math.min(prev, nextImagesResolved.length - 1) : 0));
    setImageUri(nextImagesResolved[0]);
  }, [loaded]);

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

  const handleSaveChanges = async () => {
    if (!productId || saving) return;

    const name = productName.trim();
    if (!name) {
      Alert.alert('Missing product name', 'Please enter a product name.');
      return;
    }

    const parsedPrice = Number(String(price).replace(/,/g, ''));
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      Alert.alert('Invalid price', 'Please enter a valid price.');
      return;
    }

    const parsedInventory = Number(String(inventory).replace(/,/g, ''));
    if (!Number.isFinite(parsedInventory) || parsedInventory < 0) {
      Alert.alert('Invalid inventory', 'Please enter a valid inventory number.');
      return;
    }

    const cat = typeof category === 'string' ? category : null;
    if (!cat) {
      Alert.alert('Missing category', 'Please select a category.');
      return;
    }

    try {
      setSaving(true);
      const updated = await updateProductApi(productId, {
        name,
        description: description.trim(),
        price: parsedPrice,
        inventory: parsedInventory,
        category: cat,
      });
      setLoaded(updated);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Could not save changes', e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const pickAndReplaceSelected = async () => {
    if (!productId || imageSaving) return;
    if (!images.length) return;
    try {
      const res = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.85,
      });
      if (res.didCancel) return;
      const uri = res.assets?.[0]?.uri;
      if (!uri) {
        Alert.alert('No photo selected', 'Please try again.');
        return;
      }
      setImageSaving(true);
      const updated = await replaceProductImageAtApi(productId, selectedImageIndex, uri);
      setLoaded(updated);
    } catch (e) {
      Alert.alert('Could not upload image', e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setImageSaving(false);
    }
  };

  const pickAndAdd = async () => {
    if (!productId || imageSaving) return;
    try {
      const res = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.85,
      });
      if (res.didCancel) return;
      const uri = res.assets?.[0]?.uri;
      if (!uri) {
        Alert.alert('No photo selected', 'Please try again.');
        return;
      }
      setImageSaving(true);
      const updated = await addProductImageApi(productId, uri);
      setLoaded(updated);
      const nextImagesRaw = (updated.images && Array.isArray(updated.images) ? updated.images : []).filter(Boolean);
      const nextImagesResolved = nextImagesRaw.map((s) => resolveImageUri(String(s))!).filter(Boolean);
      if (nextImagesResolved.length) setSelectedImageIndex(nextImagesResolved.length - 1);
    } catch (e) {
      Alert.alert('Could not upload image', e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setImageSaving(false);
    }
  };

  const handleDeleteSelectedImage = async () => {
    if (!productId || imageSaving) return;
    if (!images.length) return;
    try {
      setImageSaving(true);
      const updated = await deleteProductImageAtApi(productId, selectedImageIndex);
      setLoaded(updated);
    } catch (e) {
      Alert.alert('Could not delete image', e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setImageSaving(false);
    }
  };

  const productImageUri = images[selectedImageIndex] || imageUri || undefined;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {loading ? (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ marginTop: 10, color: colors.textSecondary }}>Loading product…</Text>
          </View>
        ) : null}

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
                label="Price (PKR)"
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
              <View style={styles.mediaActions}>
                <TouchableOpacity
                  style={styles.mediaActionBtn}
                  activeOpacity={0.8}
                  onPress={pickAndReplaceSelected}
                  disabled={imageSaving}
                >
                  {imageSaving ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <Icon name="edit" size={18} color={colors.white} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.mediaActionBtn, styles.mediaActionBtnDanger]}
                  activeOpacity={0.8}
                  onPress={handleDeleteSelectedImage}
                  disabled={imageSaving}
                >
                  <Icon name="delete" size={18} color={colors.white} />
                </TouchableOpacity>
              </View>
            ) : null}
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

          {images.length ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbRow}
            >
              {images.map((uri, idx) => {
                const selected = idx === selectedImageIndex;
                return (
                  <TouchableOpacity
                    key={`${uri}-${idx}`}
                    activeOpacity={0.85}
                    onPress={() => setSelectedImageIndex(idx)}
                    style={[styles.thumbWrap, selected ? styles.thumbWrapSelected : null]}
                  >
                    <Image source={{ uri }} style={styles.thumbImage} />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : null}

          <TouchableOpacity
            style={styles.changePhotoButton}
            onPress={pickAndAdd}
            activeOpacity={0.7}
            disabled={imageSaving}
          >
            <Icon name="add-photo-alternate" size={20} color={colors.textSecondary} />
            <Text style={styles.changePhotoButtonText}>Add new photo</Text>
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
          disabled={saving}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveChanges}
          activeOpacity={0.8}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
      </ScrollView>

      
    </View>
  );
};

export default EditProduct;

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { TextInput, Dropdown } from '../../../components';
import { colors } from '../../../theme';
import { styles } from './styles';
import { getMyVendorProfileApi } from '../../../api/vendorApi';
import { createProductApi, uploadProductImageApi } from '../../../api/productApi';

const CATEGORY_OPTIONS = [
  { label: 'Electronics', value: 'electronics' },
  { label: 'Home & Kitchen', value: 'home_kitchen' },
  { label: 'Food & Beverage', value: 'food_beverage' },
  { label: 'Health & Beauty', value: 'health_beauty' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Other', value: 'other' },
];

const AddProduct = () => {
  const navigation = useNavigation();
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0.00');
  const [inventory, setInventory] = useState('0');
  const [category, setCategory] = useState<string | number | null>(null);
  const [saving, setSaving] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  const handleCancel = () => {
    // TODO: confirm discard?
    navigation.goBack();
  };

  const handleSave = async () => {
    if (saving) return;
    const name = productName.trim();
    if (!name) {
      Alert.alert('Missing product name', 'Please enter a product name.');
      return;
    }
    if (!category) {
      Alert.alert('Missing category', 'Please select a category.');
      return;
    }

    const priceNum = Number(String(price).replace(/,/g, ''));
    const invNum = Number(String(inventory).replace(/,/g, ''));
    if (Number.isNaN(priceNum) || priceNum < 0) {
      Alert.alert('Invalid price', 'Please enter a valid price.');
      return;
    }
    if (Number.isNaN(invNum) || invNum < 0) {
      Alert.alert('Invalid inventory', 'Please enter a valid inventory number.');
      return;
    }

    setSaving(true);
    try {
      const vendor = await getMyVendorProfileApi();
      const vendorId = String(vendor?._id || '');
      if (!vendorId) throw new Error('Vendor profile not found');

      const created = await createProductApi(vendorId, {
        name,
        description: description.trim(),
        price: priceNum,
        inventory: invNum,
        category: String(category),
      });

      // Best-effort: upload first selected photo as product image
      if (photos[0]) {
        try {
          await uploadProductImageApi(String(created._id), photos[0]);
        } catch {
          // ignore image upload failures for now
        }
      }

      Alert.alert('Saved', 'Product created successfully.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Could not save product', e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddPhoto = () => {
    (async () => {
      try {
        const res = await launchImageLibrary({
          mediaType: 'photo',
          selectionLimit: 5,
          quality: 0.8,
        });
        if (res.didCancel) return;
        const uris = (res.assets || [])
          .map((a) => a?.uri)
          .filter((u): u is string => typeof u === 'string' && u.length > 0);
        if (uris.length === 0) {
          Alert.alert('No photo selected', 'Please try again.');
          return;
        }
        setPhotos((prev) => [...prev, ...uris].slice(0, 10));
      } catch {
        Alert.alert('Could not open gallery', 'Please try again.');
      }
    })();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputContainer}>
          <TextInput
            label="Product Name"
            placeholder="Enter product name (e.g., Organic)"
            value={productName}
            onChangeText={setProductName}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            label="Description"
            placeholder="Provide a detailed description of the product, including features and benefits."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

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

        <View style={styles.inputContainer}>
          <Dropdown
            label="Category"
            placeholder="Select a category"
            value={category}
            onChange={(v) => setCategory(v)}
            data={CATEGORY_OPTIONS}
            containerStyle={{ marginBottom: 0 }}
          />
        </View>

        <View>
          <Text style={styles.label}>Product Photos</Text>
          <TouchableOpacity
            style={styles.uploadArea}
            onPress={handleAddPhoto}
            activeOpacity={0.8}
          >
            {photos.length > 0 ? (
              <View style={styles.photoGrid}>
                {photos.map((uri) => (
                  <Image key={uri} source={{ uri }} style={styles.photoThumb} />
                ))}
              </View>
            ) : (
              <>
                <Icon
                  name="add-photo-alternate"
                  size={48}
                  color={colors.darkGray}
                  style={styles.uploadIcon}
                />
                <Text style={styles.uploadText}>
                  Drag & drop images here, or click to upload
                </Text>
              </>
            )}
            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={handleAddPhoto}
              activeOpacity={0.7}
            >
              <Text style={styles.addPhotoButtonText}>Add Photo</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.8}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.saveButtonText}>Save Product</Text>
          )}
        </TouchableOpacity>
      </View>
      </ScrollView>

     
    </View>
  );
};

export default AddProduct;

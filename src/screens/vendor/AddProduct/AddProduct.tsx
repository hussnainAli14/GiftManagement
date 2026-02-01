import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TextInput, Dropdown } from '../../../components';
import { colors } from '../../../theme';
import { styles } from './styles';

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

  const handleCancel = () => {
    // TODO: confirm discard?
    navigation.goBack();
  };

  const handleSave = () => {
    // TODO: validate and submit to API
    navigation.goBack();
  };

  const handleAddPhoto = () => {
    // TODO: open image picker
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
            <Icon
              name="add-photo-alternate"
              size={48}
              color={colors.darkGray}
              style={styles.uploadIcon}
            />
            <Text style={styles.uploadText}>
              Drag & drop images here, or click to upload
            </Text>
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
        >
          <Text style={styles.saveButtonText}>Save Product</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>

     
    </View>
  );
};

export default AddProduct;

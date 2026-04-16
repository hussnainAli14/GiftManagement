import React, { useMemo, useState } from 'react';
import { View, ScrollView, Text, Switch, Alert, Image } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { TextInput, Dropdown, Button } from '../../../components';
import type { DropdownOption } from '../../../components';
import type { WishlistDetailItemData } from '../../../components/WishlistDetailItem';
import { colors } from '../../../theme';
import { styles, deleteButtonColors } from './styles';
import { deleteWishlistItemApi, updateWishlistItemApi } from '../../../api/wishlistApi';
import { deleteNonWishlistItemApi, updateNonWishlistItemApi } from '../../../api/nonWishlistApi';
import { launchImageLibrary } from 'react-native-image-picker';

type EditItemRouteParams = {
  EditItem: { item: WishlistDetailItemData; categoryValue?: string | number; listType?: 'wishlist' | 'nonWishlist' };
};

const CATEGORY_OPTIONS: DropdownOption[] = [
  { label: 'Home Goods', value: 'home_goods' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Kitchen', value: 'kitchen' },
  { label: 'Kitchen Appliances', value: 'kitchen_appliances' },
  { label: 'Other', value: 'other' },
];

function getPriceInputValue(price: string): string {
  return price.replace(/^PKR\s*/i, '').replace(/,/g, '').trim();
}

const EditItem = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<EditItemRouteParams, 'EditItem'>>();
  const { item, categoryValue: paramCategory } = route.params ?? { item: null };
  const listType = route.params?.listType ?? 'wishlist';

  const initialPrice = useMemo(
    () => (item ? getPriceInputValue(item.price) : ''),
    [item]
  );

  const initialCategory = item?.categoryValue ?? paramCategory ?? null;

  const [itemName, setItemName] = useState(item?.title ?? '');
  const [category, setCategory] = useState<string | number | null>(
    initialCategory
  );
  const [price, setPrice] = useState(initialPrice);
  const [contributionEnabled, setContributionEnabled] = useState(
    item?.statusText?.toLowerCase().includes('enabled') ?? true
  );
  const [buyFromNearestVendor, setBuyFromNearestVendor] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>(
    typeof item?.image === 'string' ? item.image : undefined
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      includeBase64: true,
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.8,
    });

    if (result.didCancel) return;
    const asset = result.assets?.[0];
    if (!asset?.base64) {
      Alert.alert('Image', 'Unable to read image. Please try another one.');
      return;
    }
    const mime = asset.type || 'image/jpeg';
    setImageDataUrl(`data:${mime};base64,${asset.base64}`);
  };

  const handleUpdate = async () => {
    if (!item?.id) return;
    if (!itemName.trim()) {
      Alert.alert('Missing name', 'Please enter item name.');
      return;
    }
    const priceNumber = Number(getPriceInputValue(price));
    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      Alert.alert('Invalid price', 'Please enter a valid price.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (listType === 'nonWishlist') {
        await updateNonWishlistItemApi({
          itemId: item.id,
          title: itemName.trim(),
          price: priceNumber,
          category: category ? String(category) : undefined,
          image: imageDataUrl,
        });
        Alert.alert('Success', 'Non-wishlist item updated.');
      } else {
        await updateWishlistItemApi({
          itemId: item.id,
          title: itemName.trim(),
          price: priceNumber,
          category: category ? String(category) : undefined,
          allowsContribution: contributionEnabled,
          image: imageDataUrl,
        });
        Alert.alert('Success', 'Wishlist item updated.');
      }
      // Go back; WishlistDetail reloads on focus.
      navigation.goBack();
    } catch (error) {
      Alert.alert('Update Failed', error instanceof Error ? error.message : 'Unable to update item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!item?.id) return;
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setIsSubmitting(true);
            if (listType === 'nonWishlist') {
              await deleteNonWishlistItemApi(item.id);
              Alert.alert('Deleted', 'Non-wishlist item removed.');
            } else {
              await deleteWishlistItemApi(item.id);
              Alert.alert('Deleted', 'Wishlist item removed.');
            }
            navigation.goBack();
          } catch (error) {
            Alert.alert('Delete Failed', error instanceof Error ? error.message : 'Unable to delete item');
          } finally {
            setIsSubmitting(false);
          }
        },
      },
    ]);
  };

  if (!item) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.toggleLabel}>Item Image</Text>
        {imageDataUrl ? (
          <Image source={{ uri: imageDataUrl }} style={{ width: '100%', height: 180, borderRadius: 12, marginBottom: 12 }} resizeMode="cover" />
        ) : (
          <View style={{ width: '100%', height: 180, borderRadius: 12, backgroundColor: colors.lightGray, marginBottom: 12, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.darkGray }}>No image selected</Text>
          </View>
        )}
        <Button variant="secondary" fullWidth onPress={handlePickImage} style={{ marginBottom: 16 }}>
          Pick Image
        </Button>

        <TextInput
          label="Item Name"
          placeholder="e.g., 'Modern Coffee Maker'"
          value={itemName}
          onChangeText={setItemName}
          containerStyle={styles.field}
        />

        <Dropdown
          label="Category"
          placeholder="e.g., 'Home Goods'"
          value={category}
          onChange={setCategory}
          data={CATEGORY_OPTIONS}
          containerStyle={styles.field}
        />

        <TextInput
          label="Price"
          placeholder="e.g., '249.99'"
          value={price}
          onChangeText={setPrice}
          leftIcon={<Text style={styles.pricePrefix}>$</Text>}
          keyboardType="decimal-pad"
          containerStyle={styles.field}
        />

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Enable Contributions</Text>
          <Switch
            value={contributionEnabled}
            onValueChange={setContributionEnabled}
            trackColor={{ false: colors.gray, true: colors.primaryMuted }}
            thumbColor={contributionEnabled ? colors.primary : colors.white}
            disabled={listType === 'nonWishlist'}
          />
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Buy from Nearest Vendor</Text>
          <Switch
            value={buyFromNearestVendor}
            onValueChange={setBuyFromNearestVendor}
            trackColor={{ false: colors.gray, true: colors.primaryMuted }}
            thumbColor={buyFromNearestVendor ? colors.primary : colors.white}
          />
        </View>

        <View style={styles.buttonRow}>
          <Button
            variant="primary"
            size="medium"
            fullWidth
            onPress={handleUpdate}
            style={styles.updateButton}
          >
            Update Item
          </Button>
          <Button
            variant="secondary"
            size="medium"
            fullWidth
            onPress={handleDelete}
            style={styles.deleteButton}
            backgroundColor={deleteButtonColors.backgroundColor}
            textColor={deleteButtonColors.textColor}
            borderColor={deleteButtonColors.borderColor}
            borderWidth={1}
          >
            Delete Item
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditItem;

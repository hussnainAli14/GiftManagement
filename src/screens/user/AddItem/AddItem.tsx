import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { View, ScrollView, Text, Switch, Alert, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { TextInput, Dropdown, Button } from '../../../components';
import type { DropdownOption } from '../../../components';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { addWishlistItemApi } from '../../../api/wishlistApi';
import { addNonWishlistItemApi } from '../../../api/nonWishlistApi';
import { colors } from '../../../theme';
import { styles } from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';

type EventsStackParamList = {
  AddItem: { eventId?: string; listType?: 'wishlist' | 'nonWishlist' };
};

const CATEGORY_OPTIONS: DropdownOption[] = [
  { label: 'Home Goods', value: 'home_goods' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Kitchen', value: 'kitchen' },
  { label: 'Other', value: 'other' },
];

const AddItem = () => {
  const navigation = useNavigation<NativeStackNavigationProp<EventsStackParamList, 'AddItem'>>();
  const route = useRoute<RouteProp<EventsStackParamList, 'AddItem'>>();
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<string | number | null>(null);
  const [price, setPrice] = useState('');
  const [contributionEnabled, setContributionEnabled] = useState(true);
  const [buyFromNearestVendor, setBuyFromNearestVendor] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const eventId = route.params?.eventId;
  const listType = route.params?.listType ?? 'wishlist';
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>(undefined);

  const imageSource = useMemo(() => {
    if (!imageDataUrl) return null;
    return { uri: imageDataUrl };
  }, [imageDataUrl]);

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

  const handleSave = useCallback(async () => {
    if (!eventId) {
      Alert.alert('Missing event', 'No event selected.');
      return;
    }
    if (!itemName.trim() || !price.trim()) {
      Alert.alert('Missing fields', 'Please add item name and price.');
      return;
    }
    try {
      setIsSubmitting(true);
      const payload = {
        eventId,
        title: itemName.trim(),
        price: Number(price) || 0,
        category: category ? String(category) : undefined,
        image: imageDataUrl,
      };

      if (listType === 'nonWishlist') {
        await addNonWishlistItemApi(payload);
        Alert.alert('Success', 'Item added to non-wishlist.');
      } else {
        await addWishlistItemApi({
          ...payload,
          isContributable: contributionEnabled,
        });
        Alert.alert('Success', 'Item added to your wishlist.');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Failed', error instanceof Error ? error.message : 'Unable to add item');
    } finally {
      setIsSubmitting(false);
    }
  }, [eventId, itemName, price, category, contributionEnabled, navigation, listType]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSave}
          style={{ marginRight: 16 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          disabled={isSubmitting}
        >
          <Icon name="save" size={24} color={colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleSave, isSubmitting]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.toggleLabel}>Item Image</Text>
        {imageSource ? (
          <Image source={imageSource} style={{ width: '100%', height: 180, borderRadius: 12, marginBottom: 12 }} resizeMode="cover" />
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
          <Text style={styles.toggleLabel}>Contribution Enabled</Text>
          <Switch
            value={contributionEnabled}
            onValueChange={setContributionEnabled}
            trackColor={{ false: colors.gray, true: colors.primaryMuted }}
            thumbColor={contributionEnabled ? colors.primary : colors.white}
            disabled={listType === 'nonWishlist'}
          />
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Buy from nearest vendor</Text>
          <Switch
            value={buyFromNearestVendor}
            onValueChange={setBuyFromNearestVendor}
            trackColor={{ false: colors.gray, true: colors.primaryMuted }}
            thumbColor={buyFromNearestVendor ? colors.primary : colors.white}
          />
        </View>
        <Button variant="primary" fullWidth onPress={handleSave} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Item'}
        </Button>
      </ScrollView>
    </View>
  );
};

export default AddItem;

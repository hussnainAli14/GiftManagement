import React, { useState, useMemo } from 'react';
import { View, ScrollView, Text, Switch } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { TextInput, Dropdown, Button } from '../../../components';
import type { DropdownOption } from '../../../components';
import type { WishlistDetailItemData } from '../../../components/WishlistDetailItem';
import { colors } from '../../../theme';
import { styles, deleteButtonColors } from './styles';

type EditItemRouteParams = {
  EditItem: { item: WishlistDetailItemData; categoryValue?: string | number };
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
  const route = useRoute<RouteProp<EditItemRouteParams, 'EditItem'>>();
  const { item, categoryValue: paramCategory } = route.params ?? { item: null };

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
  const [contributionEnabled, setContributionEnabled] = useState(true);
  const [buyFromNearestVendor, setBuyFromNearestVendor] = useState(false);

  const handleUpdate = () => {
    // TODO: Save changes and go back
  };

  const handleDelete = () => {
    // TODO: Confirm and delete item, then go back
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

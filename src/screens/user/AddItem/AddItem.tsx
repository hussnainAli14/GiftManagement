import React, { useState } from 'react';
import { View, ScrollView, Text, Switch } from 'react-native';
import { TextInput, Dropdown } from '../../../components';
import type { DropdownOption } from '../../../components';
import { colors } from '../../../theme';
import { styles } from './styles';

const CATEGORY_OPTIONS: DropdownOption[] = [
  { label: 'Home Goods', value: 'home_goods' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Kitchen', value: 'kitchen' },
  { label: 'Other', value: 'other' },
];

const AddItem = () => {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<string | number | null>(null);
  const [price, setPrice] = useState('');
  const [contributionEnabled, setContributionEnabled] = useState(true);
  const [buyFromNearestVendor, setBuyFromNearestVendor] = useState(false);

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
          <Text style={styles.toggleLabel}>Contribution Enabled</Text>
          <Switch
            value={contributionEnabled}
            onValueChange={setContributionEnabled}
            trackColor={{ false: colors.gray, true: colors.primaryMuted }}
            thumbColor={contributionEnabled ? colors.primary : colors.white}
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
      </ScrollView>
    </View>
  );
};

export default AddItem;

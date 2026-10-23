import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Dropdown } from '../../../components';
import { colors } from '../../../theme';
import { createVendorExpenseApi } from '../../../api/vendorApi';
import { styles } from './styles';

const CATEGORY_OPTIONS = [
  { label: 'Inventory / stock', value: 'inventory' },
  { label: 'Shipping / delivery', value: 'shipping' },
  { label: 'Rent', value: 'rent' },
  { label: 'Utilities', value: 'utilities' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Salaries', value: 'salaries' },
  { label: 'Other', value: 'other' },
];

const AddExpense = () => {
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string | number | null>('inventory');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (saving) return;
    const amountNum = Number(String(amount).replace(/,/g, ''));
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      Alert.alert('Invalid amount', 'Enter an expense amount greater than zero.');
      return;
    }
    if (!category) {
      Alert.alert('Category required', 'Please select an expense category.');
      return;
    }

    setSaving(true);
    try {
      await createVendorExpenseApi({
        amount: amountNum,
        category: String(category),
        note: note.trim(),
      });
      Alert.alert('Expense added', 'Your expense was recorded.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Could not save', e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.hint}>
          Track business costs so Analytics can show Sales, Expenses, and Profit.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            label="Amount (PKR)"
            value={amount}
            onChangeText={setAmount}
            placeholder="e.g. 2000"
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Dropdown
            label="Category"
            data={CATEGORY_OPTIONS}
            value={category}
            onChange={(v) => setCategory(v)}
            placeholder="Select category"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            label="Note (optional)"
            value={note}
            onChangeText={setNote}
            placeholder="What was this for?"
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.saveButtonText}>Save expense</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AddExpense;

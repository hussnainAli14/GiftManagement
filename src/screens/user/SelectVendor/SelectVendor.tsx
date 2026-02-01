import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { VendorItem } from './types';
import { DUMMY_VENDORS } from './types';
import { Button } from '../../../components';
import type { PersonsWishlistItemData } from '../../../components/PersonsWishlistItem';
import { colors } from '../../../theme';
import { styles } from './styles';

export type SelectVendorParams = {
  item: PersonsWishlistItemData;
  eventTitle?: string;
};

type SelectVendorRouteProp = RouteProp<
  { params: SelectVendorParams },
  'params'
>;

type SelectVendorStackParamList = {
  SelectVendor: SelectVendorParams;
  ConfirmOrder: {
    item: PersonsWishlistItemData;
    vendor: VendorItem;
    eventTitle?: string;
  };
};

const SelectVendor = () => {
  const route = useRoute<SelectVendorRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<SelectVendorStackParamList, 'SelectVendor'>>();
  const { item, eventTitle } = route.params ?? {};

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const toggleVendor = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const selectedVendor = selectedId
    ? DUMMY_VENDORS.find((v) => v.id === selectedId)
    : null;

  const handleProceed = () => {
    if (!item || !selectedVendor) return;
    navigation.navigate('ConfirmOrder', { item, vendor: selectedVendor, eventTitle });
  };

  const renderItem = ({ item: vendor }: { item: VendorItem }) => {
    const isSelected = selectedId === vendor.id;
    return (
      <TouchableOpacity
        style={styles.vendorCard}
        onPress={() => toggleVendor(vendor.id)}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: vendor.image }}
          style={styles.vendorImage}
          resizeMode="cover"
        />
        <View style={styles.vendorContent}>
          <Text style={styles.vendorName}>{vendor.name}</Text>
          <View style={styles.vendorAddress}>
            <Icon name="location-on" size={16} color={colors.darkGray} />
            <Text style={styles.vendorAddressText} numberOfLines={2}>
              {vendor.address}
            </Text>
          </View>
          <Text style={styles.vendorDistance}>{vendor.distance}</Text>
        </View>
        <View
          style={[
            styles.checkbox,
            isSelected && styles.checkboxSelected,
          ]}
        >
          {isSelected ? (
            <Icon name="check" size={16} color={colors.white} />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={DUMMY_VENDORS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.footer}>
        <Button
          variant="primary"
          fullWidth
          onPress={handleProceed}
          disabled={!item || !selectedVendor}
        >
          Proceed
        </Button>
      </View>
    </View>
  );
};

export default SelectVendor;

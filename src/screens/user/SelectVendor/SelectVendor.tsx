import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { VendorItem } from './types';
import { Button } from '../../../components';
import type { PersonsWishlistItemData } from '../../../components/PersonsWishlistItem';
import { colors } from '../../../theme';
import { styles } from './styles';
import { getVendorsApi, type VendorModel } from '../../../api/vendorApi';

function mapVendorToItem(v: VendorModel, index: number): VendorItem {
  const displayName = v.businessName || v.name || 'Vendor';
  return {
    id: v._id,
    name: displayName,
    address: v.businessAddress || '—',
    distance: '—',
    image: `https://picsum.photos/seed/vendor-${v._id}/${400 + (index % 5)}/200`,
  };
}

/** Params may be missing if the screen opens without navigating from Gift Options. */
export type SelectVendorParams = {
  item?: PersonsWishlistItemData;
  eventTitle?: string;
};

type SelectVendorStackParamList = {
  SelectVendor: SelectVendorParams | undefined;
  ConfirmOrder: {
    item: PersonsWishlistItemData;
    vendor: VendorItem;
    eventTitle?: string;
  };
};

type SelectVendorRouteProp = RouteProp<SelectVendorStackParamList, 'SelectVendor'>;

function parseSelectVendorParams(route: {
  params?: SelectVendorParams | undefined;
}): { wishlistItem: PersonsWishlistItemData | undefined; eventTitle: string | undefined } {
  const p = route.params;
  if (p == null || typeof p !== 'object') {
    return { wishlistItem: undefined, eventTitle: undefined };
  }
  return {
    wishlistItem: p.item,
    eventTitle: p.eventTitle,
  };
}

const SelectVendor = () => {
  const route = useRoute<SelectVendorRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<SelectVendorStackParamList, 'SelectVendor'>>();
  const { wishlistItem, eventTitle } = parseSelectVendorParams(route);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [loading, setLoading] = useState(!!wishlistItem);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    if (!wishlistItem) {
      setVendors([]);
      setFetchError(false);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    const load = async () => {
      try {
        setFetchError(false);
        const list = await getVendorsApi();
        const approved = list.filter((v) => v.isApproved === true);
        const mapped = approved.map((v, i) => mapVendorToItem(v, i));
        if (!cancelled) setVendors(mapped);
      } catch {
        if (!cancelled) {
          setVendors([]);
          setFetchError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [wishlistItem]);

  const toggleVendor = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const selectedVendor = selectedId
    ? vendors.find((v) => v.id === selectedId)
    : null;

  const handleProceed = () => {
    if (!wishlistItem || !selectedVendor) return;
    navigation.navigate('ConfirmOrder', { item: wishlistItem, vendor: selectedVendor, eventTitle });
  };

  const renderVendorRow = ({ item: vendor }: { item: VendorItem }) => {
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

  if (!wishlistItem) {
    return (
      <View style={styles.container}>
        <View style={styles.missingParamsWrap}>
          <Text style={styles.emptyListText}>
            Gift details are missing. Go back and open Select Vendor from Gift Options after choosing a gift.
          </Text>
        </View>
      </View>
    );
  }

  const emptyMessage = fetchError
    ? 'Could not load vendors. Check your connection and try again.'
    : 'No approved vendors available yet.';

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={styles.loadingSpinner} color={colors.primary} />
      ) : (
        <FlatList
          data={vendors}
          renderItem={renderVendorRow}
          keyExtractor={(row) => row.id}
          contentContainerStyle={
            vendors.length === 0
              ? [styles.listContent, styles.listContentWhenEmpty]
              : styles.listContent
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.listEmptyWrap}>
              <Text style={styles.emptyListText}>{emptyMessage}</Text>
            </View>
          }
        />
      )}
      <View style={styles.footer}>
        <Button
          variant="primary"
          fullWidth
          onPress={handleProceed}
          disabled={!selectedVendor}
        >
          Proceed
        </Button>
      </View>
    </View>
  );
};

export default SelectVendor;

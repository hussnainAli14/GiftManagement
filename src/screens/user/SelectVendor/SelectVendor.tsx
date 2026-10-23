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
import { getVendorsNearUserApi, type VendorModel } from '../../../api/vendorApi';
import { formatVendorLocation } from '../../../utils/formatVendorLocation';
import { formatBusinessCityCountry } from '../../../utils/formatEnglishBusinessAddress';

function normalizeRating(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

function mapVendorToItem(v: VendorModel, index: number): VendorItem {
  const displayName = v.businessName || v.name || 'Vendor';
  const locationLabel = formatVendorLocation(v);
  const rating = normalizeRating(v.averageRating);
  const item: VendorItem = {
    id: v._id,
    name: displayName,
    image: `https://picsum.photos/seed/vendor-${v._id}/${400 + (index % 5)}/200`,
    rating,
    locationLabel,
    cityLabel: formatBusinessCityCountry(v),
  };
  if (typeof v.distanceKm === 'number' && Number.isFinite(v.distanceKm)) {
    item.distanceKm = v.distanceKm;
    item.distance = `${v.distanceKm.toFixed(1)} km away`;
  }
  return item;
}

/** Params may be missing if the screen opens without navigating from Gift Options. */
export type SelectVendorParams = {
  item?: PersonsWishlistItemData;
  eventTitle?: string;
  flow?: 'full' | 'contribute';
  eventId?: string;
  wishlistOwnerId?: string;
  eventOwnerId?: string;
};

type SelectVendorStackParamList = {
  SelectVendor: SelectVendorParams | undefined;
  ConfirmOrder: {
    item: PersonsWishlistItemData;
    vendor: VendorItem;
    eventTitle?: string;
    recipientUserId?: string;
  };
  ContributionProgress: {
    item: PersonsWishlistItemData;
    eventTitle?: string;
    eventId?: string;
    wishlistOwnerId?: string;
    eventOwnerId?: string;
    vendorId: string;
    vendorName?: string;
  };
};

type SelectVendorRouteProp = RouteProp<SelectVendorStackParamList, 'SelectVendor'>;

function parseSelectVendorParams(route: {
  params?: SelectVendorParams | undefined;
}) {
  const p = route.params;
  if (p == null || typeof p !== 'object') {
    return {
      wishlistItem: undefined as PersonsWishlistItemData | undefined,
      eventTitle: undefined as string | undefined,
      flow: 'full' as const,
      eventId: undefined as string | undefined,
      wishlistOwnerId: undefined as string | undefined,
      eventOwnerId: undefined as string | undefined,
    };
  }
  return {
    wishlistItem: p.item,
    eventTitle: p.eventTitle,
    flow: p.flow ?? 'full',
    eventId: p.eventId,
    wishlistOwnerId: p.wishlistOwnerId,
    eventOwnerId: p.eventOwnerId,
  };
}

const SelectVendor = () => {
  const route = useRoute<SelectVendorRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<SelectVendorStackParamList, 'SelectVendor'>>();
  const { wishlistItem, eventTitle, flow, eventId, wishlistOwnerId, eventOwnerId } =
    parseSelectVendorParams(route);
  const isContributionFlow = flow === 'contribute';

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [loading, setLoading] = useState(!!wishlistItem);
  const [fetchError, setFetchError] = useState(false);
  const [emptyHint, setEmptyHint] = useState<string | undefined>();

  const recipientUserId = wishlistOwnerId ?? eventOwnerId;

  useEffect(() => {
    if (!wishlistItem) {
      setVendors([]);
      setFetchError(false);
      setEmptyHint(undefined);
      setLoading(false);
      return;
    }

    if (!recipientUserId) {
      setVendors([]);
      setFetchError(false);
      setEmptyHint('Gift recipient is unknown. Cannot show vendors for their city.');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    const load = async () => {
      try {
        setFetchError(false);
        setEmptyHint(undefined);
        const {
          vendors: list,
          hasRecipientCity,
          recipientCity,
        } = await getVendorsNearUserApi(recipientUserId);
        const mapped = list.map((v, i) => mapVendorToItem(v, i));
        if (!cancelled) {
          setVendors(mapped);
          if (!hasRecipientCity) {
            setEmptyHint(
              'This person has not set their city yet. Ask them to update their profile.',
            );
          } else if (mapped.length === 0) {
            const cityLabel = recipientCity ? ` in ${recipientCity}` : '';
            setEmptyHint(`No vendors are available${cityLabel} for this gift yet.`);
          }
        }
      } catch {
        if (!cancelled) {
          setVendors([]);
          setFetchError(true);
          setEmptyHint(undefined);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [wishlistItem, recipientUserId]);

  const toggleVendor = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const selectedVendor = selectedId
    ? vendors.find((v) => v.id === selectedId)
    : null;

  const handleProceed = () => {
    if (!wishlistItem || !selectedVendor) return;
    if (isContributionFlow) {
      navigation.navigate('ContributionProgress', {
        item: wishlistItem,
        eventTitle,
        eventId,
        wishlistOwnerId,
        eventOwnerId,
        vendorId: selectedVendor.id,
        vendorName: selectedVendor.name,
      });
      return;
    }
    navigation.navigate('ConfirmOrder', {
      item: wishlistItem,
      vendor: selectedVendor,
      eventTitle,
      recipientUserId,
    });
  };

  const renderVendorRow = ({ item: vendor }: { item: VendorItem }) => {
    const isSelected = selectedId === vendor.id;
    const ratingLabel = normalizeRating(vendor.rating).toFixed(1);
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
          <View style={styles.vendorMetaRow}>
            <View style={styles.ratingRow}>
              <Icon name="star" size={16} color={colors.primary} />
              <Text style={styles.ratingText}>{ratingLabel}</Text>
            </View>
            {vendor.locationLabel ? (
              <View style={styles.vendorAddress}>
                <Icon name="location-on" size={16} color={colors.darkGray} />
                <Text style={styles.vendorAddressText} numberOfLines={2}>
                  {vendor.locationLabel}
                </Text>
              </View>
            ) : (
              <Text style={styles.locationUnavailable}>Location not available</Text>
            )}
            {vendor.distance ? (
              <Text style={styles.vendorDistance}>{vendor.distance}</Text>
            ) : null}
          </View>
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
    : emptyHint ?? 'No vendors available in this gift recipient\'s city.';

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
          {isContributionFlow ? 'Continue to contribution' : 'Proceed'}
        </Button>
      </View>
    </View>
  );
};

export default SelectVendor;

import React, { useMemo, useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, CityPicker, TextInput } from '../../../components';
import { styles } from './styles';
import { parsePrice } from './types';
import type { ConfirmOrderParams } from './types';
import { colors } from '../../../theme';
import { hasDisplayValue } from '../../../utils/hasDisplayValue';
import {
  getEnglishAddressForCityId,
  getPakistanCityById,
  PAKISTAN_CITY_DROPDOWN_OPTIONS,
} from '../../../data/pakistanCities';

type ConfirmOrderStackParamList = {
  ConfirmOrder: ConfirmOrderParams;
  Payment: {
    amount: number;
    description: string;
    isFullGift: boolean;
    wishlistItemId?: string;
    vendorId?: string;
    deliveryRecipientName?: string;
    deliveryAddress?: string;
    deliveryCity?: string;
    customerPhone?: string;
  };
};

type ConfirmOrderRouteProp = RouteProp<
  { params: ConfirmOrderParams },
  'params'
>;

const SHIPPING_RATE = 0.07; // 7% of subtotal
const TAX_RATE = 0.085; // 8.5% of subtotal

const ConfirmOrder = () => {
  const route = useRoute<ConfirmOrderRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<ConfirmOrderStackParamList, 'ConfirmOrder'>>();
  const { item, vendor, eventTitle } = route.params ?? {};

  const [recipientName, setRecipientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [cityId, setCityId] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  if (!item || !vendor) {
    return null;
  }

  const imageSource =
    typeof item.image === 'string' ? { uri: item.image } : item.image;
  const subtotal = parsePrice(item.price);
  const shipping = Math.round(subtotal * SHIPPING_RATE * 100) / 100;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  const formatPkr = (n: number) =>
    `PKR ${n.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`;

  const errors = useMemo(() => {
    const next: {
      recipientName?: string;
      phoneNumber?: string;
      streetAddress?: string;
      cityId?: string;
    } = {};
    if (recipientName.trim().length < 2) {
      next.recipientName = 'Recipient name is required';
    }
    const phoneDigits = phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      next.phoneNumber = 'Enter a valid phone number';
    }
    if (streetAddress.trim().length < 5) {
      next.streetAddress = 'Enter a complete street address';
    }
    if (!cityId.trim()) {
      next.cityId = 'Select a city';
    }
    return next;
  }, [recipientName, phoneNumber, streetAddress, cityId]);

  const isDeliveryValid = Object.keys(errors).length === 0;

  const handleProceedToPayment = () => {
    if (!isDeliveryValid) {
      setShowErrors(true);
      return;
    }

    const city = getPakistanCityById(cityId);
    const cityLabel = city?.name || getEnglishAddressForCityId(cityId)?.split(',')[0] || '';
    const deliveryAddress = `${streetAddress.trim()}, ${cityLabel}, Pakistan`;

    const description = eventTitle
      ? `For ${item.title} - ${eventTitle} Wishlist`
      : `For ${item.title}`;
    navigation.navigate('Payment', {
      amount: total,
      description,
      isFullGift: true,
      wishlistItemId: item.id,
      vendorId: vendor.id,
      vendorName: vendor.name,
      deliveryRecipientName: recipientName.trim(),
      deliveryAddress,
      deliveryCity: cityLabel,
      customerPhone: phoneNumber.trim(),
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Gift Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Gift Details</Text>
          <View style={styles.giftRow}>
            <Image
              source={imageSource}
              style={styles.giftImage}
              resizeMode="cover"
            />
            <View style={styles.giftContent}>
              <Text style={styles.giftName} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.giftMeta}>Quantity: 1</Text>
              <Text style={styles.giftPrice}>{item.price}</Text>
            </View>
          </View>
        </View>

        {/* Vendor */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Vendor</Text>
          <View style={styles.vendorRow}>
            <Icon name="store" size={18} color={colors.darkGray} />
            <Text style={styles.vendorText}>{vendor.name}</Text>
          </View>
          {hasDisplayValue(vendor.address) ? (
            <View style={styles.vendorRow}>
              <Icon name="location-on" size={18} color={colors.darkGray} />
              <Text style={styles.vendorText}>{vendor.address}</Text>
            </View>
          ) : null}
        </View>

        {/* Delivery Address */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <Text style={styles.deliveryHint}>
            Where should this gift be delivered?
          </Text>
          <TextInput
            label="Recipient Name"
            placeholder="Full name of the recipient"
            value={recipientName}
            onChangeText={setRecipientName}
            leftIcon={<Icon name="person" size={20} color={colors.primaryMuted} />}
            error={showErrors ? errors.recipientName : undefined}
            autoCapitalize="words"
            containerStyle={styles.inputContainer}
          />
          <TextInput
            label="Phone Number"
            placeholder="03XX XXXXXXX"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            leftIcon={<Icon name="phone" size={20} color={colors.primaryMuted} />}
            error={showErrors ? errors.phoneNumber : undefined}
            keyboardType="phone-pad"
            containerStyle={styles.inputContainer}
          />
          <TextInput
            label="Street Address"
            placeholder="House / apartment, street, area"
            value={streetAddress}
            onChangeText={setStreetAddress}
            leftIcon={<Icon name="home" size={20} color={colors.primaryMuted} />}
            error={showErrors ? errors.streetAddress : undefined}
            autoCapitalize="words"
            containerStyle={styles.inputContainer}
          />
          <CityPicker
            label="City"
            placeholder="Select delivery city"
            value={cityId}
            onChange={setCityId}
            options={PAKISTAN_CITY_DROPDOWN_OPTIONS}
            error={showErrors ? errors.cityId : undefined}
            containerStyle={styles.inputContainer}
          />
        </View>

        {/* Price Summary */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Price Summary</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>{formatPkr(subtotal)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Shipping</Text>
            <Text style={styles.priceValue}>{formatPkr(shipping)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tax</Text>
            <Text style={styles.priceValue}>{formatPkr(tax)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPkr(total)}</Text>
          </View>
        </View>

        <Button
          variant="primary"
          fullWidth
          onPress={handleProceedToPayment}
          style={styles.proceedButton}
        >
          Proceed to Payment
        </Button>
      </ScrollView>
    </View>
  );
};

export default ConfirmOrder;

import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from '../../../components';
import { styles } from './styles';
import { DEFAULT_DELIVERY, parsePrice } from './types';
import type { ConfirmOrderParams } from './types';
import { colors } from '../../../theme';

type ConfirmOrderStackParamList = {
  ConfirmOrder: ConfirmOrderParams;
  Payment: { amount: number; description: string; isFullGift: boolean };
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

  const handleProceedToPayment = () => {
    const description = eventTitle
      ? `For ${item.title} - ${eventTitle} Wishlist`
      : `For ${item.title}`;
    navigation.navigate('Payment', {
      amount: total,
      description,
      isFullGift: true,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
          <View style={styles.vendorRow}>
            <Icon name="location-on" size={18} color={colors.darkGray} />
            <Text style={styles.vendorText}>{vendor.address}</Text>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.deliveryRow}>
            <Icon name="person" size={18} color={colors.darkGray} />
            <Text style={styles.deliveryText}>{DEFAULT_DELIVERY.recipientName}</Text>
          </View>
          <View style={styles.deliveryRow}>
            <Icon name="location-on" size={18} color={colors.darkGray} />
            <Text style={styles.deliveryText}>{DEFAULT_DELIVERY.address}</Text>
          </View>
          <View style={styles.deliveryRow}>
            <Icon name="event" size={18} color={colors.darkGray} />
            <Text style={styles.deliveryText}>
              Estimated: {DEFAULT_DELIVERY.estimatedDate}
            </Text>
          </View>
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

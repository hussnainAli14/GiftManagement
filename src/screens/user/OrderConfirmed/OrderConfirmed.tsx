import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from '../../../components';
import { styles } from './styles';
import { colors } from '../../../theme';

export type OrderConfirmedParams = {
  orderId?: string;
  productId?: string;
  productName?: string;
  vendorId?: string;
  vendorName?: string;
  summary?: string;
};

type OrderConfirmedParamList = {
  OrderConfirmed: OrderConfirmedParams | undefined;
  MyOrders: undefined;
  ProductReview: {
    orderId: string;
    productId?: string;
    productName?: string;
  };
  VendorReview: {
    vendorId: string;
    vendorName?: string;
    orderId: string;
  };
};

const OrderConfirmed = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<OrderConfirmedParamList, 'OrderConfirmed'>>();
  const route = useRoute<RouteProp<{ params: OrderConfirmedParams }, 'params'>>();
  const {
    orderId,
    productId,
    productName,
    vendorId,
    vendorName,
    summary,
  } = route.params ?? {};

  const canRateGift = Boolean(orderId);
  const canRateVendor = Boolean(orderId && vendorId);

  const handleContinueGifting = () => {
    navigation.getParent()?.navigate('Home' as never);
  };

  const handleRateGift = () => {
    if (!orderId) return;
    navigation.navigate('ProductReview', {
      orderId,
      productId,
      productName,
    });
  };

  const handleRateVendor = () => {
    if (!orderId || !vendorId) return;
    navigation.navigate('VendorReview', {
      vendorId,
      vendorName,
      orderId,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Icon name="check" size={56} color={colors.black} />
        </View>
        <Text style={styles.title}>Order Confirmed</Text>
        <Text style={styles.message}>
          Thank you for sharing joy! Your gift has been ordered and will be delivered soon.
        </Text>
        {summary ? <Text style={styles.summary}>{summary}</Text> : null}

        <Button
          variant="primaryPurple"
          fullWidth
          onPress={handleContinueGifting}
          style={styles.primaryButton}
        >
          Continue Gifting
        </Button>

        {canRateGift ? (
          <Button
            variant="secondaryPurple"
            fullWidth
            onPress={handleRateGift}
            style={styles.secondaryButton}
          >
            Rate Gift
          </Button>
        ) : null}

        {canRateVendor ? (
          <Button
            variant="secondaryPurple"
            fullWidth
            onPress={handleRateVendor}
            style={styles.secondaryButton}
          >
            Rate Vendor
          </Button>
        ) : null}
      </View>
    </View>
  );
};

export default OrderConfirmed;

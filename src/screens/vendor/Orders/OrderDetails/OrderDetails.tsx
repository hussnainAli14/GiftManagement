import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../../../theme';
import type { OrderDetailsScreenParams } from './types';
import type { VendorOrderDetail } from './types';
import { getOrderDetail } from './mockDetail';
import { styles, VENDOR_BLUE_COLOR } from './styles';

type OrdersStackParamList = {
  OrdersMain: undefined;
  OrderDetails: OrderDetailsScreenParams;
};

const OrderDetails = () => {
  const route = useRoute<RouteProp<OrdersStackParamList, 'OrderDetails'>>();
  const navigation = useNavigation<NativeStackNavigationProp<OrdersStackParamList, 'OrderDetails'>>();
  const { order } = route.params ?? {};
  const detail: VendorOrderDetail | undefined = order ? getOrderDetail(order) : undefined;

  if (!order || !detail) {
    return (
      <View style={styles.container}>
        <Text style={{ padding: 16 }}>Order not found.</Text>
      </View>
    );
  }

  const isPending = order.status === 'Pending';

  const handleAcceptOrder = () => {
    // TODO: API call to accept order
    navigation.goBack();
  };

  const handleProcessOrder = () => {
    // TODO: API call to process / mark delivered
    navigation.goBack();
  };

  const openEmail = () => Linking.openURL(`mailto:${detail.email}`);
  const openPhone = () => Linking.openURL(`tel:${detail.phone.replace(/\s/g, '')}`);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          // { paddingBottom: isPending ? 80 + insets.bottom : 24 + insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Order ID</Text>
            <Text style={styles.orderId}>#{detail.order.orderId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Order Date</Text>
            <Text style={styles.rowValue}>{detail.orderDate}</Text>
          </View>
          <View style={[styles.row, { marginBottom: 0 }]}>
            <Text style={styles.rowLabel}>Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>{detail.order.status}</Text>
            </View>
          </View>
        </View>

        {/* Customer Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Details</Text>
          <Text style={styles.rowLabel}>Name</Text>
          <Text style={styles.addressText}>{detail.customerName}</Text>
          <Text style={[styles.rowLabel, { marginTop: 12 }]}>Shipping Address</Text>
          <Text style={styles.addressText}>{detail.shippingAddress}</Text>
          <TouchableOpacity style={styles.linkRow} onPress={openEmail} activeOpacity={0.7}>
            <Icon name="email" size={18} color={VENDOR_BLUE_COLOR} style={styles.linkIcon} />
            <Text style={styles.link}>{detail.email}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} onPress={openPhone} activeOpacity={0.7}>
            <Icon name="phone" size={18} color={VENDOR_BLUE_COLOR} style={styles.linkIcon} />
            <Text style={styles.link}>{detail.phone}</Text>
          </TouchableOpacity>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {detail.items.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.itemRow,
                index === detail.items.length - 1 ? styles.itemRowLast : undefined,
              ]}
            >
              <View style={styles.itemThumb}>
                {item.imageUri ? (
                  <Image
                    source={{ uri: typeof item.imageUri === 'string' ? item.imageUri : undefined }}
                    style={styles.itemThumbImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Icon
                    name="inventory-2"
                    size={24}
                    color={colors.darkGray}
                    style={{ alignSelf: 'center', marginTop: 12 }}
                  />
                )}
              </View>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>{item.price}</Text>
            </View>
          ))}
        </View>

        {/* Payment Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Subtotal</Text>
            <Text style={styles.rowValue}>{detail.subtotal}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Shipping</Text>
            <Text style={styles.rowValue}>{detail.shipping}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Tax</Text>
            <Text style={styles.rowValue}>{detail.tax}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{detail.total}</Text>
          </View>
        </View>
        {isPending && (
        <View style={styles.footer}>
          <View style={styles.footerButtonColumn}>
            <TouchableOpacity
              style={styles.footerButtonAccept}
              onPress={handleAcceptOrder}
              activeOpacity={0.8}
            >
              <Text style={styles.footerButtonTextPrimary}>Accept Order</Text>
            </TouchableOpacity>
            <Text style={styles.footerButtonSubtext}>Out for Delivery</Text>
          </View>
          <View style={styles.footerButtonColumn}>
            <TouchableOpacity
              style={styles.footerButtonProcess}
              onPress={handleProcessOrder}
              activeOpacity={0.8}
            >
              <Text style={styles.footerButtonTextOutline}>Process Order</Text>
            </TouchableOpacity>
            <Text style={styles.footerButtonSubtext}>Mark as Delivered</Text>
          </View>
        </View>
      )}
      </ScrollView>

      {/* Footer with buttons below content - only for Pending orders */}
   
    </View>
  );
};

export default OrderDetails;

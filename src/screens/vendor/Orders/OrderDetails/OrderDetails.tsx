import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../../../theme';
import type { OrderDetailsScreenParams } from './types';
import { styles, VENDOR_BLUE_COLOR } from './styles';
import { mapOrderToDetail } from '../orderDetailMapper';
import { getVendorOrderByIdApi, updateVendorOrderStatusApi } from '../../../../api/orderApi';

type OrdersStackParamList = {
  OrdersMain: undefined;
  OrderDetails: OrderDetailsScreenParams;
};

const OrderDetails = () => {
  const route = useRoute<RouteProp<OrdersStackParamList, 'OrderDetails'>>();
  const navigation = useNavigation<NativeStackNavigationProp<OrdersStackParamList, 'OrderDetails'>>();
  const { order: initialOrder, backendOrder: initialBackendOrder } = route.params ?? {};
  const [backendOrder, setBackendOrder] = useState(initialBackendOrder);
  const [statusOverride, setStatusOverride] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const orderId = initialBackendOrder?._id;
    if (!orderId) return;

    let cancelled = false;
    (async () => {
      try {
        const fresh = await getVendorOrderByIdApi(String(orderId));
        if (!cancelled) setBackendOrder(fresh);
      } catch {
        // Keep list payload if detail refresh fails.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialBackendOrder?._id]);

  const detail = useMemo(() => {
    if (!backendOrder || !initialOrder) return undefined;
    const mapped = mapOrderToDetail(backendOrder, initialOrder);
    if (statusOverride) {
      mapped.order.status = statusOverride as typeof mapped.order.status;
    }
    return mapped;
  }, [backendOrder, initialOrder, statusOverride]);

  const handleAcceptOrder = useCallback(async () => {
    if (!backendOrder?._id) return;
    try {
      setUpdating(true);
      const updated = await updateVendorOrderStatusApi(String(backendOrder._id), 'approved');
      setBackendOrder(updated);
      setStatusOverride('Order Approved');
    } catch (error) {
      Alert.alert(
        'Could not accept order',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setUpdating(false);
    }
  }, [backendOrder?._id]);

  const handleProcessOrder = useCallback(async () => {
    if (!backendOrder?._id) return;
    try {
      setUpdating(true);
      const updated = await updateVendorOrderStatusApi(String(backendOrder._id), 'delivered');
      setBackendOrder(updated);
      setStatusOverride('Delivered');
    } catch (error) {
      Alert.alert(
        'Could not update order',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setUpdating(false);
    }
  }, [backendOrder?._id]);

  if (!initialOrder || !detail) {
    return (
      <View style={styles.container}>
        <Text style={{ padding: 16 }}>Order not found.</Text>
      </View>
    );
  }

  const currentStatus = statusOverride ?? detail.order.status;
  const isPending = currentStatus === 'Placed' || String(backendOrder?.status).toLowerCase() === 'pending';
  const isApproved =
    currentStatus === 'Order Approved' || String(backendOrder?.status).toLowerCase() === 'approved';

  const openEmail = () => {
    if (detail.email && detail.email !== '—') {
      Linking.openURL(`mailto:${detail.email}`);
    }
  };

  const openPhone = () => {
    if (detail.phone && detail.phone !== '—') {
      Linking.openURL(`tel:${detail.phone.replace(/\s/g, '')}`);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
              <Text style={styles.statusBadgeText}>{currentStatus}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Details</Text>
          <Text style={styles.rowLabel}>Placed by</Text>
          <Text style={styles.addressText}>{detail.customerName}</Text>
          <Text style={[styles.rowLabel, { marginTop: 12 }]}>Customer Address</Text>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {detail.items.length === 0 ? (
            <Text style={styles.rowValue}>No items found.</Text>
          ) : (
            detail.items.map((item, index) => (
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
            ))
          )}
        </View>

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

        {(isPending || isApproved) && (
          <View style={styles.footer}>
            {isPending ? (
              <View style={styles.footerButtonColumn}>
                <TouchableOpacity
                  style={styles.footerButtonAccept}
                  onPress={handleAcceptOrder}
                  activeOpacity={0.8}
                  disabled={updating}
                >
                  {updating ? (
                    <ActivityIndicator color={colors.white} />
                  ) : (
                    <Text style={styles.footerButtonTextPrimary}>Accept Order</Text>
                  )}
                </TouchableOpacity>
                <Text style={styles.footerButtonSubtext}>Approve this order</Text>
              </View>
            ) : null}
            {isApproved ? (
              <View style={styles.footerButtonColumn}>
                <TouchableOpacity
                  style={styles.footerButtonProcess}
                  onPress={handleProcessOrder}
                  activeOpacity={0.8}
                  disabled={updating}
                >
                  {updating ? (
                    <ActivityIndicator color={VENDOR_BLUE_COLOR} />
                  ) : (
                    <Text style={styles.footerButtonTextOutline}>Process Order</Text>
                  )}
                </TouchableOpacity>
                <Text style={styles.footerButtonSubtext}>Mark as Delivered</Text>
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default OrderDetails;

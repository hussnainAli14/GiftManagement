import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import {
  DEFAULT_VENDOR,
  DEFAULT_DELIVERY,
  DEFAULT_PAYMENT,
  getOrderTimeline,
} from './types';
import type { OrderDetailParams, StatusStep } from './types';
import type { OrderEntry } from '../MyOrders/types';
import { colors } from '../../../theme';
import { getMyProductReviewForOrderApi, getMyVendorReviewForOrderApi } from '../../../api/reviewApi';
import { cancelOrderApi } from '../../../api/orderApi';

type StackParamList = {
  OrderDetail: OrderDetailParams;
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

type OrderDetailRouteProp = RouteProp<{ params: OrderDetailParams }, 'params'>;

const getItemImageUri = (item: { image?: string }, index: number) =>
  item.image ?? `https://picsum.photos/seed/orderitem${index}/80/80`;

const OrderDetail = () => {
  const route = useRoute<OrderDetailRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const { order: initialOrder } = route.params ?? { order: null };
  const [order, setOrder] = useState<OrderEntry | null>(initialOrder ?? null);
  const [reviewedKeys, setReviewedKeys] = useState<Record<string, boolean>>({});
  const [checkingReviews, setCheckingReviews] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [vendorReviewedIds, setVendorReviewedIds] = useState<Record<string, boolean>>({});
  const [checkingVendorReview, setCheckingVendorReview] = useState(false);

  const canRate = order && order.status !== 'Cancelled';
  const canCancel = Boolean(order?.id) && String(order?.rawStatus || '').toLowerCase() === 'pending';

  const vendorTargets = useMemo(() => {
    if (!order) return [] as Array<{ vendorId: string }>;
    const ids = new Set<string>();
    for (const item of order.items) {
      if (item.vendorId) ids.add(item.vendorId);
    }
    return [...ids].map((vendorId) => ({ vendorId }));
  }, [order]);

  const loadReviewState = useCallback(async () => {
    if (!order?.id || !canRate) return;
    setCheckingReviews(true);
    setCheckingVendorReview(true);
    try {
      const entries = await Promise.all(
        order.items.map(async (item, index) => {
          const key = `${item.productId || item.name}-${index}`;
          try {
            const existing = await getMyProductReviewForOrderApi(order.id, item.productId);
            return [key, Boolean(existing)] as const;
          } catch {
            return [key, false] as const;
          }
        }),
      );
      setReviewedKeys(Object.fromEntries(entries));

      if (vendorTargets.length) {
        const vendorEntries = await Promise.all(
          vendorTargets.map(async (v) => {
            try {
              const existing = await getMyVendorReviewForOrderApi(order.id, v.vendorId);
              return [v.vendorId, Boolean(existing)] as const;
            } catch {
              return [v.vendorId, false] as const;
            }
          }),
        );
        setVendorReviewedIds(Object.fromEntries(vendorEntries));
      } else {
        setVendorReviewedIds({});
      }
    } finally {
      setCheckingReviews(false);
      setCheckingVendorReview(false);
    }
  }, [order, canRate, vendorTargets]);

  useFocusEffect(
    useCallback(() => {
      loadReviewState();
    }, [loadReviewState]),
  );

  const handleCancelOrder = useCallback(() => {
    if (!order?.id || cancelling) return;

    Alert.alert(
      'Cancel order?',
      'This will cancel your pending order. Stock will be restored and any reward points from this order will be reversed.',
      [
        { text: 'Keep order', style: 'cancel' },
        {
          text: 'Cancel order',
          style: 'destructive',
          onPress: async () => {
            try {
              setCancelling(true);
              await cancelOrderApi(order.id);
              setOrder((prev) =>
                prev
                  ? {
                      ...prev,
                      status: 'Cancelled',
                      rawStatus: 'cancelled',
                    }
                  : prev,
              );
              Alert.alert('Order cancelled', 'Your order has been cancelled.', [
                {
                  text: 'OK',
                  onPress: () => {
                    if (navigation.canGoBack()) {
                      navigation.goBack();
                    } else {
                      navigation.navigate('MyOrders');
                    }
                  },
                },
              ]);
            } catch (error) {
              Alert.alert(
                'Could not cancel',
                error instanceof Error ? error.message : 'Please try again.',
              );
            } finally {
              setCancelling(false);
            }
          },
        },
      ],
    );
  }, [order?.id, cancelling, navigation]);

  if (!order) {
    return null;
  }

  const timeline = getOrderTimeline(order);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <Text style={styles.orderIdText}>Order {order.id}</Text>
            <View style={styles.dateRow}>
              <Icon name="event" size={20} color={colors.darkGray} />
              <Text style={{ fontFamily: 'Inter-Regular', fontSize: 14, color: colors.darkGray }}>
                {order.date}
              </Text>
            </View>
          </View>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>{order.total}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Status</Text>
          {timeline.map((step: StatusStep, index: number) => (
            <View key={step.label} style={styles.timelineStep}>
              <View style={{ position: 'relative' }}>
                <View
                  style={[
                    styles.timelineIconWrap,
                    step.completed ? styles.timelineIconWrapCompleted : styles.timelineIconWrapPending,
                  ]}
                >
                  <Icon
                    name={step.icon as any}
                    size={18}
                    color={step.completed ? colors.white : colors.darkGray}
                  />
                </View>
                {index < timeline.length - 1 ? (
                  <View style={styles.timelineConnector} />
                ) : null}
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>{step.label}</Text>
                <Text style={styles.timelineDate}>{step.dateTime}</Text>
              </View>
            </View>
          ))}
        </View>

        {canCancel ? (
          <>
            <TouchableOpacity
              style={[styles.cancelButton, cancelling && styles.cancelButtonDisabled]}
              activeOpacity={0.8}
              disabled={cancelling}
              onPress={handleCancelOrder}
            >
              {cancelling ? (
                <ActivityIndicator color={colors.errorRed} />
              ) : (
                <>
                  <Icon name="cancel" size={20} color={colors.errorRed} />
                  <Text style={styles.cancelButtonText}>Cancel order</Text>
                </>
              )}
            </TouchableOpacity>
            <Text style={styles.cancelHint}>You can cancel while the order is still pending.</Text>
          </>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items.map((item, index) => {
            const key = `${item.productId || item.name}-${index}`;
            const alreadyReviewed = reviewedKeys[key];
            return (
              <View key={key} style={styles.itemBlock}>
                <View style={styles.itemRow}>
                  <Image
                    source={{ uri: getItemImageUri(item, index) }}
                    style={styles.itemImage}
                    resizeMode="cover"
                  />
                  <View style={styles.itemContent}>
                    <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                  </View>
                  <Text style={styles.itemPrice}>{item.price}</Text>
                </View>
                {canRate ? (
                  checkingReviews ? (
                    <ActivityIndicator color={colors.primary} style={styles.rateLoader} />
                  ) : alreadyReviewed ? (
                    <View style={styles.reviewedBadge}>
                      <Icon name="check-circle" size={16} color={colors.successGreen} />
                      <Text style={styles.reviewedText}>Reviewed</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.rateButton}
                      activeOpacity={0.8}
                      onPress={() =>
                        navigation.navigate('ProductReview', {
                          orderId: order.id,
                          productId: item.productId,
                          productName: item.name,
                        })
                      }
                    >
                      <Icon name="star" size={18} color={colors.white} />
                      <Text style={styles.rateButtonText}>Rate this gift</Text>
                    </TouchableOpacity>
                  )
                ) : null}
              </View>
            );
          })}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Vendor Information</Text>
          <View style={styles.infoRow}>
            <Icon name="store" size={20} color={colors.darkGray} />
            <Text style={styles.infoText}>{DEFAULT_VENDOR.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="location-on" size={20} color={colors.darkGray} />
            <Text style={styles.infoText}>{DEFAULT_VENDOR.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="email" size={20} color={colors.darkGray} />
            <Text style={styles.infoText}>{DEFAULT_VENDOR.email}</Text>
          </View>
          {canRate && vendorTargets.length > 0 ? (
            checkingVendorReview ? (
              <ActivityIndicator color={colors.primary} style={styles.rateLoader} />
            ) : (
              vendorTargets.map((v) =>
                vendorReviewedIds[v.vendorId] ? (
                  <View key={v.vendorId} style={styles.reviewedBadge}>
                    <Icon name="check-circle" size={16} color={colors.successGreen} />
                    <Text style={styles.reviewedText}>Vendor rated</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    key={v.vendorId}
                    style={[styles.rateButton, styles.rateVendorButton]}
                    activeOpacity={0.8}
                    onPress={() =>
                      navigation.navigate('VendorReview', {
                        vendorId: v.vendorId,
                        orderId: order.id,
                      })
                    }
                  >
                    <Icon name="storefront" size={18} color={colors.white} />
                    <Text style={styles.rateButtonText}>Rate vendor</Text>
                  </TouchableOpacity>
                ),
              )
            )
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <View style={styles.infoRow}>
            <Icon name="location-on" size={20} color={colors.darkGray} />
            <Text style={styles.infoText}>{DEFAULT_DELIVERY.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="schedule" size={20} color={colors.darkGray} />
            <Text style={styles.infoText}>{DEFAULT_DELIVERY.timeRange}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.infoRow}>
            <Icon name="credit-card" size={20} color={colors.darkGray} />
            <Text style={styles.infoText}>{DEFAULT_PAYMENT.method}</Text>
          </View>
          {order.giftWrapping ? (
            <View style={styles.infoRow}>
              <Icon name="card-giftcard" size={20} color={colors.darkGray} />
              <Text style={styles.infoText}>
                Gift wrapping
                {order.giftWrappingFee
                  ? ` · PKR ${order.giftWrappingFee.toLocaleString('en-PK')}`
                  : ''}
              </Text>
            </View>
          ) : null}
          {order.digitalGiftCard ? (
            <View style={styles.infoRow}>
              <Icon name="mail-outline" size={20} color={colors.darkGray} />
              <Text style={styles.infoText}>
                Digital gift card
                {order.digitalGiftCardTheme ? ` · ${order.digitalGiftCardTheme}` : ''}
                {order.digitalGiftCardFee
                  ? ` · PKR ${order.digitalGiftCardFee.toLocaleString('en-PK')}`
                  : ''}
                {order.digitalGiftCardMessage
                  ? `\n"${order.digitalGiftCardMessage}"`
                  : ''}
              </Text>
            </View>
          ) : null}
          <View style={styles.paymentRow}>
            <Text style={styles.amountPaidLabel}>Amount Paid</Text>
            <Text style={styles.amountPaidValue}>{order.total}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderDetail;

import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import type { OrderEntry, OrderStatus } from './types';
import { cancelOrderApi, getMyOrdersApi, type OrderModel } from '../../../api/orderApi';
import { useAuth } from '../../../context/AuthContext';
import { colors } from '../../../theme';

type MyOrdersStackParamList = {
  MyOrders: undefined;
  OrderDetail: { order: OrderEntry };
};

function mapOrderStatus(status?: string): OrderStatus {
  const normalized = (status ?? '').toLowerCase();
  if (normalized === 'delivered' || normalized === 'completed') return 'Delivered';
  if (normalized === 'cancelled') return 'Cancelled';
  return 'Processing';
}

function resolveRefId(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null && '_id' in value) {
    const id = (value as { _id?: string })._id;
    return id ? String(id) : undefined;
  }
  return undefined;
}

function mapOrderToEntry(order: OrderModel): OrderEntry {
  return {
    id: order._id,
    date: order.createdAt
      ? new Date(order.createdAt).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '—',
    status: mapOrderStatus(order.status),
    rawStatus: order.status,
    items:
      order.items?.map((item) => {
        const productId = resolveRefId(item.productId);
        const productObj =
          item.productId && typeof item.productId === 'object' ? item.productId : undefined;
        return {
          name:
            item.title ||
            productObj?.name ||
            item.giftId?.name ||
            'Item',
          quantity: item.quantity || 1,
          price: `PKR ${(item.price ?? productObj?.price ?? 0).toLocaleString('en-PK')}`,
          image: item.image || productObj?.image || item.giftId?.image,
          productId,
          vendorId: resolveRefId(item.vendorId),
        };
      }) || [],
    total: `PKR ${(order.totalAmount ?? 0).toLocaleString('en-PK')}`,
    giftWrapping: Boolean(order.giftWrapping),
    giftWrappingFee: Number(order.giftWrappingFee) || 0,
    digitalGiftCard: Boolean(order.digitalGiftCard),
    digitalGiftCardFee: Number(order.digitalGiftCardFee) || 0,
    digitalGiftCardMessage: order.digitalGiftCardMessage || '',
    digitalGiftCardTheme: order.digitalGiftCardTheme || null,
  };
}

const getStatusStyle = (status: OrderStatus) => {
  switch (status) {
    case 'Delivered':
      return { backgroundColor: colors.statusDelivered };
    case 'Processing':
      return { backgroundColor: colors.statusProcessing };
    case 'Cancelled':
      return { backgroundColor: colors.statusCancelled };
    default:
      return { backgroundColor: colors.darkGray };
  }
};

const OrderCard = ({
  order,
  cancelling,
  onViewDetails,
  onCancel,
}: {
  order: OrderEntry;
  cancelling: boolean;
  onViewDetails: (order: OrderEntry) => void;
  onCancel: (order: OrderEntry) => void;
}) => {
  const canCancel = String(order.rawStatus || '').toLowerCase() === 'pending';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>Order ID: {order.id.slice(-8).toUpperCase()}</Text>
        <View style={[styles.statusBadge, getStatusStyle(order.status)]}>
          <Text style={styles.statusBadgeText}>{order.status}</Text>
        </View>
      </View>
      <Text style={styles.date}>Date: {order.date}</Text>
      <Text style={styles.itemsLabel}>Items:</Text>
      {order.items.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name} x{item.quantity}
          </Text>
          <Text style={styles.itemPrice}>{item.price}</Text>
        </View>
      ))}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{order.total}</Text>
      </View>
      <View style={styles.cardActions}>
        {canCancel ? (
          <TouchableOpacity
            style={styles.cancelOrderButton}
            onPress={() => onCancel(order)}
            disabled={cancelling}
            activeOpacity={0.7}
          >
            {cancelling ? (
              <ActivityIndicator size="small" color={colors.errorRed} />
            ) : (
              <>
                <Icon name="cancel" size={18} color={colors.errorRed} />
                <Text style={styles.cancelOrderText}>Cancel</Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <View />
        )}
        <TouchableOpacity
          style={styles.viewDetailsButton}
          onPress={() => onViewDetails(order)}
          activeOpacity={0.7}
        >
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Icon name="chevron-right" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const MyOrders = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MyOrdersStackParamList, 'MyOrders'>>();
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    if (!user?.id) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const result = await getMyOrdersApi(user.id);
      setOrders(result.map(mapOrderToEntry));
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders])
  );

  const handleViewDetails = (order: OrderEntry) => {
    navigation.navigate('OrderDetail', { order });
  };

  const handleCancel = (order: OrderEntry) => {
    Alert.alert(
      'Cancel order?',
      'This will cancel your pending order and restore stock.',
      [
        { text: 'Keep order', style: 'cancel' },
        {
          text: 'Cancel order',
          style: 'destructive',
          onPress: async () => {
            try {
              setCancellingId(order.id);
              await cancelOrderApi(order.id);
              setOrders((prev) =>
                prev.map((o) =>
                  o.id === order.id
                    ? { ...o, status: 'Cancelled', rawStatus: 'cancelled' }
                    : o,
                ),
              );
            } catch (error) {
              Alert.alert(
                'Could not cancel',
                error instanceof Error ? error.message : 'Please try again.',
              );
            } finally {
              setCancellingId(null);
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator style={{ marginTop: 32 }} color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={orders.length === 0 ? styles.listContentEmpty : styles.listContent}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            cancelling={cancellingId === item.id}
            onViewDetails={handleViewDetails}
            onCancel={handleCancel}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            You have not placed any orders yet. Gifts and contributions will appear here after checkout.
          </Text>
        }
      />
    </View>
  );
};

export default MyOrders;

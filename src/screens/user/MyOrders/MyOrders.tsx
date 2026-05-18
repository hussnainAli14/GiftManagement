import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import type { OrderEntry, OrderStatus } from './types';
import { getMyOrdersApi, type OrderModel } from '../../../api/orderApi';
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
    items:
      order.items?.map((item) => ({
        name:
          item.title ||
          item.productId?.name ||
          item.giftId?.name ||
          'Item',
        quantity: item.quantity || 1,
        price: `PKR ${(item.price ?? item.productId?.price ?? 0).toLocaleString('en-PK')}`,
        image: item.image || item.productId?.image || item.giftId?.image,
      })) || [],
    total: `PKR ${(order.totalAmount ?? 0).toLocaleString('en-PK')}`,
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

const OrderCard = ({ order, onViewDetails }: { order: OrderEntry; onViewDetails: (order: OrderEntry) => void }) => (
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
    <TouchableOpacity
      style={styles.viewDetailsButton}
      onPress={() => onViewDetails(order)}
      activeOpacity={0.7}
    >
      <Text style={styles.viewDetailsText}>View Details</Text>
      <Icon name="chevron-right" size={20} color={colors.primary} />
    </TouchableOpacity>
  </View>
);

const MyOrders = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MyOrdersStackParamList, 'MyOrders'>>();
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderEntry[]>([]);
  const [loading, setLoading] = useState(true);

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
          <OrderCard order={item} onViewDetails={handleViewDetails} />
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

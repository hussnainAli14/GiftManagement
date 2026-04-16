import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Search } from '../../../components';
import { colors } from '../../../theme';
import { styles, BADGE_COLORS } from './styles';
import { getMyVendorOrdersApi, type BackendOrder } from '../../../api/orderApi';
import { API_ORIGIN } from '../../../api/config';

type OrdersStackParamList = {
  OrdersMain: undefined;
  OrderDetails: { order: VendorOrderItem };
};

export type OrderStatus = 'Delivered' | 'Out for Delivery' | 'Processing' | 'Pending';

export type VendorOrderItem = {
  id: string;
  orderId: string;
  customerName: string;
  total: string;
  status: OrderStatus;
  imageUri?: string | number;
};

function resolveImageUri(raw: unknown): string | undefined {
  const s = String(raw || '').trim();
  if (!s) return undefined;
  if (s.startsWith('/')) return `${API_ORIGIN}${s}`;
  return s;
}

function formatPKR(amount: number | undefined): string {
  const n = typeof amount === 'number' && Number.isFinite(amount) ? amount : 0;
  return `Rs ${n.toFixed(2)}`;
}

function toUiStatus(status: BackendOrder['status']): OrderStatus {
  const s = String(status || '').toLowerCase();
  if (s === 'delivered') return 'Delivered';
  if (s === 'pending') return 'Pending';
  if (s === 'completed') return 'Processing';
  if (s === 'cancelled') return 'Processing';
  return 'Processing';
}

function shortOrderId(id: string): string {
  const s = String(id || '');
  return s.length > 6 ? s.slice(-6).toUpperCase() : s.toUpperCase();
}

function mapOrderToItem(o: BackendOrder): VendorOrderItem {
  const id = String(o._id || '');
  const customerName =
    typeof o.userId === 'object' && o.userId && 'name' in o.userId
      ? String(o.userId.name || 'Customer')
      : 'Customer';

  const firstProduct =
    o.items?.find((it) => it && typeof it.productId === 'object' && it.productId)?.productId as
      | { image?: string; images?: string[] }
      | undefined;
  const img = firstProduct?.images?.[0] || firstProduct?.image;

  return {
    id,
    orderId: shortOrderId(id),
    customerName,
    total: formatPKR(o.totalAmount),
    status: toUiStatus(o.status),
    imageUri: resolveImageUri(img),
  };
}

const Orders = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<OrdersStackParamList, 'OrdersMain'>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<VendorOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const raw = await getMyVendorOrdersApi();
        const mapped = raw.map(mapOrderToItem);
        if (!cancelled) setOrders(mapped);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load orders.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((o) => {
      return (
        o.orderId.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q)
      );
    });
  }, [orders, searchQuery]);

  const renderStatus = (status: OrderStatus) => {
    const isBadge = status === 'Out for Delivery' || status === 'Pending';
    const badgeBg = status === 'Out for Delivery' ? BADGE_COLORS.outForDelivery : BADGE_COLORS.pending;
    if (isBadge) {
      return (
        <View style={[styles.statusBadge, { backgroundColor: badgeBg }]}>
          <Text style={styles.statusBadgeText}>{status}</Text>
        </View>
      );
    }
    return <Text style={styles.statusPlain}>{status}</Text>;
  };

  const renderOrderCard = ({ item }: { item: VendorOrderItem }) => (
    <TouchableOpacity
      style={styles.orderCard}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('OrderDetails', { order: item })}
    >
      <View style={styles.productImage}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.productImageFill} resizeMode="cover" />
        ) : (
          <Icon name="inventory-2" size={28} color={colors.darkGray} style={{ alignSelf: 'center', marginTop: 14 }} />
        )}
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.orderId} numberOfLines={1}>Order #{item.orderId}</Text>
        <Text style={styles.customerName} numberOfLines={1}>{item.customerName}</Text>
        <Text style={styles.orderTotal}>{item.total}</Text>
      </View>
      <View style={styles.statusRow}>
        {renderStatus(item.status)}
        <Icon name="chevron-right" size={24} color={colors.darkGray} style={styles.chevron} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.searchWrapper}>
          <Search
            placeholder="Search orders..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => {}} activeOpacity={0.7}>
          <Icon name="filter-list" size={22} color={colors.black} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderCard}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <View style={{ paddingTop: 24, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={{ marginTop: 10, color: colors.textSecondary }}>Loading orders…</Text>
            </View>
          ) : error ? (
            <View style={{ paddingTop: 24 }}>
              <Text style={{ color: colors.errorRed, textAlign: 'center' }}>{error}</Text>
            </View>
          ) : (
            <View style={{ paddingTop: 24 }}>
              <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>No orders found.</Text>
            </View>
          )
        }
      />
    </View>
  );
};

export default Orders;

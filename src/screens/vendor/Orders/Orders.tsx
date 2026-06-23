import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Search } from '../../../components';
import { colors } from '../../../theme';
import { styles, BADGE_COLORS } from './styles';
import { getApprovedOrdersByCityApi, getMyVendorOrdersApi, type BackendOrder } from '../../../api/orderApi';
import { compareCitiesAsc } from './orderCity';
import { aggregateApprovedOrdersByCustomer, type VendorCustomerOrderCount } from './customerOrderCounts';
import { mapOrderToListItem, type OrderStatus, type VendorOrderListItem } from './orderDetailMapper';

export type { OrderStatus };
export type VendorOrderItem = VendorOrderListItem;

export type VendorOrdersSortBy = 'city' | 'amount' | 'customerCount';

type OrdersStackParamList = {
  OrdersMain: { sortBy?: VendorOrdersSortBy } | undefined;
  OrderDetails: { order: VendorOrderItem; backendOrder: BackendOrder };
};

type OrdersMainRouteProp = RouteProp<OrdersStackParamList, 'OrdersMain'>;

const Orders = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute<OrdersMainRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<OrdersStackParamList, 'OrdersMain'>>();
  const sortBy = route.params?.sortBy;
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<VendorOrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const usesAllVendorsFeed =
        sortBy === 'city' || sortBy === 'amount' || sortBy === 'customerCount';
      const raw = usesAllVendorsFeed
        ? await getApprovedOrdersByCityApi()
        : await getMyVendorOrdersApi();
      setOrders(raw.map(mapOrderToListItem));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load orders.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  useFocusEffect(
    React.useCallback(() => {
      loadOrders();
    }, [loadOrders])
  );

  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = sortBy === 'city' || sortBy === 'amount'
      ? orders.filter((o) => o.status === 'Order Approved')
      : orders;

    list = !q
      ? list
      : list.filter((o) => {
          return (
            o.orderId.toLowerCase().includes(q) ||
            o.customerName.toLowerCase().includes(q) ||
            o.city.toLowerCase().includes(q) ||
            o.status.toLowerCase().includes(q)
          );
        });

    if (sortBy === 'city') {
      list = [...list].sort((a, b) => {
        const byCity = compareCitiesAsc(a.city, b.city);
        if (byCity !== 0) return byCity;
        return a.orderId.localeCompare(b.orderId, undefined, { sensitivity: 'base' });
      });
    } else if (sortBy === 'amount') {
      list = [...list].sort((a, b) => {
        const byAmount = b.totalAmount - a.totalAmount;
        if (byAmount !== 0) return byAmount;
        return a.orderId.localeCompare(b.orderId, undefined, { sensitivity: 'base' });
      });
    }

    return list;
  }, [orders, searchQuery, sortBy]);

  const customerOrderCounts = useMemo(() => {
    if (sortBy !== 'customerCount') return [];
    const aggregated = aggregateApprovedOrdersByCustomer(orders);
    const q = searchQuery.trim().toLowerCase();
    if (!q) return aggregated;
    return aggregated.filter((item) => item.customerName.toLowerCase().includes(q));
  }, [orders, searchQuery, sortBy]);

  const isCustomerCountView = sortBy === 'customerCount';

  const renderStatus = (status: OrderStatus) => {
    const isBadge =
      status === 'Placed' || status === 'Completed' || status === 'Order Approved';
    const badgeBg =
      status === 'Placed'
        ? BADGE_COLORS.pending
        : status === 'Order Approved'
          ? '#22C55E'
          : status === 'Completed'
            ? BADGE_COLORS.completed
            : BADGE_COLORS.pending;
    if (isBadge) {
      return (
        <View style={[styles.statusBadge, { backgroundColor: badgeBg }]}>
          <Text style={styles.statusBadgeText}>{status}</Text>
        </View>
      );
    }
    return <Text style={styles.statusPlain}>{status}</Text>;
  };

  const renderCustomerCard = ({ item }: { item: VendorCustomerOrderCount }) => (
    <View style={styles.orderCard}>
      <View style={styles.customerAvatar}>
        <Icon name="person" size={28} color={colors.darkGray} />
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.customerName} numberOfLines={1}>{item.customerName}</Text>
        <Text style={styles.orderTotal}>
          {item.orderCount} {item.orderCount === 1 ? 'order' : 'orders'}
        </Text>
      </View>
      <View style={styles.customerCountBadge}>
        <Text style={styles.customerCountBadgeText}>{item.orderCount}</Text>
      </View>
    </View>
  );

  const renderOrderCard = ({ item }: { item: VendorOrderListItem }) => (
    <TouchableOpacity
      style={styles.orderCard}
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate('OrderDetails', {
          order: item,
          backendOrder: item.backendOrder,
        })
      }
    >
      <View style={styles.productImage}>
        {item.imageUri ? (
          <Image source={{ uri: String(item.imageUri) }} style={styles.productImageFill} resizeMode="cover" />
        ) : (
          <Icon name="inventory-2" size={28} color={colors.darkGray} style={{ alignSelf: 'center', marginTop: 14 }} />
        )}
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.orderId} numberOfLines={1}>Order #{item.orderId}</Text>
        <Text style={styles.customerName} numberOfLines={1}>{item.customerName}</Text>
        {sortBy === 'city' ? (
          <Text style={styles.orderCity} numberOfLines={1}>{item.city}</Text>
        ) : null}
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
      {sortBy === 'city' ? (
        <Text style={styles.citySortHint}>
          Approved orders from all vendors, sorted A–Z by city
        </Text>
      ) : sortBy === 'amount' ? (
        <Text style={styles.citySortHint}>
          Approved orders from all vendors, sorted by amount, highest to lowest
        </Text>
      ) : sortBy === 'customerCount' ? (
        <Text style={styles.citySortHint}>
          Approved orders per customer across all vendors, highest to lowest
        </Text>
      ) : null}
      <View style={styles.searchRow}>
        <View style={styles.searchWrapper}>
          <Search
            placeholder={
              sortBy === 'city'
                ? 'Search by city, customer, order…'
                : sortBy === 'amount'
                  ? 'Search by customer, order, amount…'
                  : sortBy === 'customerCount'
                    ? 'Search by customer name…'
                    : 'Search orders...'
            }
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => {}} activeOpacity={0.7}>
          <Icon name="filter-list" size={22} color={colors.black} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={isCustomerCountView ? customerOrderCounts : filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={isCustomerCountView ? renderCustomerCard : renderOrderCard}
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
              <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>
                {isCustomerCountView ? 'No customers found.' : 'No orders found.'}
              </Text>
            </View>
          )
        }
      />
    </View>
  );
};

export default Orders;

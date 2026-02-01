import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Search } from '../../../components';
import { colors } from '../../../theme';
import { styles, BADGE_COLORS } from './styles';

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

const MOCK_ORDERS: VendorOrderItem[] = [
  { id: '1', orderId: 'MC1001', customerName: 'Alice Johnson', total: 'Rs 125.00', status: 'Delivered', imageUri: 'https://picsum.photos/seed/order1/200/200' },
  { id: '2', orderId: 'MC1002', customerName: 'Bob Williams', total: 'Rs 75.50', status: 'Out for Delivery', imageUri: 'https://picsum.photos/seed/order2/200/200' },
  { id: '3', orderId: 'MC1003', customerName: 'Charlie Davis', total: 'Rs 220.00', status: 'Processing', imageUri: 'https://picsum.photos/seed/order3/200/200' },
  { id: '4', orderId: 'MC1004', customerName: 'Diana Miller', total: 'Rs 49.99', status: 'Pending', imageUri: 'https://picsum.photos/seed/order4/200/200' },
  { id: '5', orderId: 'MC1005', customerName: 'Eve Brown', total: 'Rs 15.20', status: 'Delivered', imageUri: 'https://picsum.photos/seed/order5/200/200' },
  { id: '6', orderId: 'MC1006', customerName: 'Frank White', total: 'Rs 300.00', status: 'Processing', imageUri: 'https://picsum.photos/seed/order6/200/200' },
];

const Orders = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<OrdersStackParamList, 'OrdersMain'>>();
  const [searchQuery, setSearchQuery] = useState('');

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
        data={MOCK_ORDERS}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderCard}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Orders;

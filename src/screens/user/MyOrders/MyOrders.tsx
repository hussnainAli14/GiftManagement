import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import { DUMMY_ORDERS } from './types';
import type { OrderEntry, OrderStatus } from './types';
import { colors } from '../../../theme';

type MyOrdersStackParamList = {
  MyOrders: undefined;
  OrderDetail: { order: OrderEntry };
};

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
      <Text style={styles.orderId}>Order ID: {order.id}</Text>
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

  const handleViewDetails = (order: OrderEntry) => {
    navigation.navigate('OrderDetail', { order });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={DUMMY_ORDERS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <OrderCard order={item} onViewDetails={handleViewDetails} />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default MyOrders;

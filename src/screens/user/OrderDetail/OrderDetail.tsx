import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
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

type OrderDetailRouteProp = RouteProp<{ params: OrderDetailParams }, 'params'>;

const getItemImageUri = (item: { image?: string }, index: number) =>
  item.image ?? `https://picsum.photos/seed/orderitem${index}/80/80`;

const OrderDetail = () => {
  const route = useRoute<OrderDetailRouteProp>();
  const { order } = route.params ?? { order: null };

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
        {/* Order Summary */}
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

        {/* Order Status Timeline */}
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

        {/* Order Items */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
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
          ))}
        </View>

        {/* Vendor Information */}
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
        </View>

        {/* Delivery Information */}
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

        {/* Payment Information */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.infoRow}>
            <Icon name="credit-card" size={20} color={colors.darkGray} />
            <Text style={styles.infoText}>{DEFAULT_PAYMENT.method}</Text>
          </View>
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

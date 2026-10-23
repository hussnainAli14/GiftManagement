import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from '../../../components';
import {
  confirmDeliveryReceiptApi,
  getOrderByIdApi,
  type BackendOrder,
} from '../../../api/orderApi';
import { colors } from '../../../theme';
import { styles } from './styles';

type Params = { orderId: string; itemTitle?: string };

type RoutePropType = RouteProp<{ params: Params }, 'params'>;

type StackParamList = {
  ConfirmDeliveryReceipt: Params;
};

const ConfirmDeliveryReceipt = () => {
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const orderId = route.params?.orderId;
  const paramItemTitle = route.params?.itemTitle;

  const [order, setOrder] = useState<BackendOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await getOrderByIdApi(orderId);
        if (!cancelled) setOrder(data);
      } catch (e) {
        if (!cancelled) {
          Alert.alert('Error', e instanceof Error ? e.message : 'Could not load this order.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const itemTitle =
    paramItemTitle
    || order?.items?.[0]?.title
    || (typeof order?.items?.[0]?.productId === 'object'
      ? order.items[0].productId?.name
      : undefined)
    || 'your gift';

  const receiptStatus = order?.deliveryReceiptStatus;

  const alreadyResponded = receiptStatus === 'confirmed' || receiptStatus === 'denied';

  const handleRespond = async (confirmed: boolean) => {
    if (!orderId || submitting) return;
    setSubmitting(true);
    try {
      await confirmDeliveryReceiptApi(orderId, confirmed);
      Alert.alert(
        confirmed ? 'Thank you' : 'Noted',
        confirmed
          ? 'You confirmed that you received this order. The sender has been notified.'
          : 'You marked that you did not receive this order.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (e) {
      Alert.alert(
        'Could not submit',
        e instanceof Error ? e.message : 'Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!orderId || !order) {
    return (
      <View style={styles.centered}>
        <Text style={styles.subtitle}>Order details are missing.</Text>
        <Button variant="primary" onPress={() => navigation.goBack()}>
          Go back
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.iconWrap}>
          <Icon name="local-shipping" size={48} color={colors.primary} />
        </View>
        <Text style={styles.title}>Your order is delivered</Text>
        <Text style={styles.subtitle}>
          Did you receive &quot;{itemTitle}&quot;?
        </Text>

        {alreadyResponded ? (
          <Text style={styles.statusNote}>
            You already answered:{' '}
            {receiptStatus === 'confirmed' ? 'Yes, received' : 'No, not received'}.
          </Text>
        ) : (
          <View style={styles.actions}>
            <Button
              variant="primary"
              fullWidth
              onPress={() => handleRespond(true)}
              disabled={submitting}
              style={styles.yesButton}
            >
              {submitting ? 'Submitting...' : 'Yes'}
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onPress={() => handleRespond(false)}
              disabled={submitting}
            >
              No
            </Button>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ConfirmDeliveryReceipt;

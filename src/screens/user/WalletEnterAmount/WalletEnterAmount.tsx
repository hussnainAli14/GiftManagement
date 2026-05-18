import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../../../components';
import { colors } from '../../../theme';
import { buildWalletPaymentParams } from '../Payment/walletPaymentParams';
import { styles } from './styles';

export type WalletEnterAmountParams =
  | { mode: 'topup' }
  | {
      mode: 'pay_to_wallet';
      recipientUserId: string;
      recipientName?: string;
      eventId?: string;
      eventTitle?: string;
    };

type RoutePropType = RouteProp<{ params: WalletEnterAmountParams }, 'params'>;

type StackParamList = {
  WalletEnterAmount: WalletEnterAmountParams;
  Payment: {
    amount: number;
    description: string;
    isWalletTopUp?: boolean;
    isPayToWallet?: boolean;
    payToWalletRecipientId?: string;
    eventTitle?: string;
    eventId?: string;
  };
};

const WalletEnterAmount = () => {
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const params = route.params ?? { mode: 'topup' as const };
  const [amount, setAmount] = useState('');

  const isTopUp = params.mode === 'topup';

  const handleContinue = () => {
    const value = parseFloat(amount);
    if (!Number.isFinite(value) || value <= 0) {
      Alert.alert('Enter an amount', 'Please enter a valid amount greater than zero.');
      return;
    }

    if (isTopUp) {
      navigation.push(
        'Payment',
        buildWalletPaymentParams({ mode: 'topup', amount: value }),
      );
      return;
    }

    const recipientLabel = params.recipientName?.trim() || 'the event host';
    const eventLabel = params.eventTitle?.trim();
    const description = eventLabel
      ? `Pay to wallet — ${eventLabel}`
      : `Pay to wallet — ${recipientLabel}`;

    navigation.push(
      'Payment',
      buildWalletPaymentParams({
        mode: 'pay_to_wallet',
        amount: value,
        recipientUserId: params.recipientUserId,
        eventId: params.eventId,
        eventTitle: params.eventTitle,
        description,
      }),
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>{isTopUp ? 'Top up wallet' : 'Pay to wallet'}</Text>
      <Text style={styles.subtitle}>
        {isTopUp
          ? 'Enter how much you want to add to your wallet.'
          : `Send money to ${params.recipientName || 'the event host'}'s wallet${
              params.eventTitle ? ` for "${params.eventTitle}"` : ''
            }.`}
      </Text>
      <Text style={styles.label}>Amount (PKR)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 1000"
        placeholderTextColor={colors.textSecondary}
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />
      <Button variant="primary" fullWidth onPress={handleContinue}>
        Continue to payment
      </Button>
    </ScrollView>
  );
};

export default WalletEnterAmount;

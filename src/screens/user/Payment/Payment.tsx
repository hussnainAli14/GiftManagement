import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from '../../../components';
import { styles } from './styles';
import type { PaymentParams, PaymentMethod } from './types';
import { colors } from '../../../theme';

type PaymentRouteProp = RouteProp<{ params: PaymentParams }, 'params'>;

type PaymentStackParamList = {
  Payment: PaymentParams;
  OrderConfirmed: undefined;
  ContributionSuccess: { eventTitle?: string };
};

const formatPkr = (n: number) =>
  `PKR ${n.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`;

const WALLET_OPTIONS: { id: PaymentMethod; label: string; icon: string }[] = [
  { id: 'google_pay', label: 'Google Pay', icon: 'credit-card' },
  { id: 'apple_pay', label: 'Apple Pay', icon: 'credit-card' },
  { id: 'other_wallet', label: 'Other Digital Wallet', icon: 'account-balance-wallet' },
];

const Payment = () => {
  const route = useRoute<PaymentRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<PaymentStackParamList, 'Payment'>>();
  const { amount, description, isFullGift, isContribution = false, eventTitle } = route.params ?? {
    amount: 0,
    description: '',
    isFullGift: false,
    isContribution: false,
    eventTitle: undefined,
  };

  const [cardNumber, setCardNumber] = useState('');
  const [mmYY, setMmYY] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const cardComplete =
    cardNumber.trim().length >= 13 &&
    /^\d{2}\/\d{2}$/.test(mmYY.trim()) &&
    cvv.trim().length >= 3;

  const canPay = cardComplete || selectedMethod !== null;

  const handlePayNow = () => {
    if (!canPay) return;
    if (isFullGift) {
      navigation.navigate('OrderConfirmed');
    } else if (isContribution) {
      navigation.navigate('ContributionSuccess', { eventTitle });
    } else {
      navigation.navigate('OrderConfirmed');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Amount Due */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount Due</Text>
          <Text style={styles.amountValue}>{formatPkr(amount)}</Text>
          <Text style={styles.amountDescription}>{description}</Text>
        </View>

        {/* Credit Card Details */}
        <Text style={styles.sectionTitle}>Credit Card Details</Text>
        <Text style={styles.sectionSubtitle}>Securely enter your card information</Text>
        <TextInput
          style={styles.input}
          placeholder="Card Number"
          placeholderTextColor={colors.darkGray}
          value={cardNumber}
          onChangeText={setCardNumber}
          keyboardType="number-pad"
          maxLength={19}
        />
        <View style={styles.inputRow}>
          <View style={styles.inputHalf}>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              placeholderTextColor={colors.darkGray}
              value={mmYY}
              onChangeText={(t) => {
                const v = t.replace(/\D/g, '').slice(0, 4);
                if (v.length >= 2)
                  setMmYY(v.slice(0, 2) + '/' + v.slice(2));
                else setMmYY(v);
              }}
              keyboardType="number-pad"
              maxLength={5}
            />
          </View>
          <View style={styles.inputHalf}>
            <TextInput
              style={styles.input}
              placeholder="CVV"
              placeholderTextColor={colors.darkGray}
              value={cvv}
              onChangeText={(t) => setCvv(t.replace(/\D/g, '').slice(0, 4))}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setSaveCard(!saveCard)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, saveCard && styles.checkboxChecked]}>
            {saveCard ? <Icon name="check" size={14} color={colors.white} /> : null}
          </View>
          <Text style={styles.checkboxLabel}>Save card details for future payments</Text>
        </TouchableOpacity>

        {/* Payment method selection */}
        <Text style={styles.paymentMethodTitle}>Payment Method</Text>
        {WALLET_OPTIONS.map((opt) => {
          const isSelected = selectedMethod === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              style={[styles.walletOption, isSelected && styles.walletOptionSelected]}
              onPress={() => setSelectedMethod(isSelected ? null : opt.id)}
              activeOpacity={0.7}
            >
              <View style={styles.walletIcon}>
                <Icon name={opt.icon as any} size={24} color={colors.darkGray} />
              </View>
              <Text style={styles.walletText}>{opt.label}</Text>
              <Icon name="chevron-right" size={24} color={colors.darkGray} />
            </TouchableOpacity>
          );
        })}

        {/* Refund Policy */}
        <View style={styles.refundCard}>
          <Text style={styles.refundTitle}>Refund Policy</Text>
          <Text style={styles.refundText}>
            Eligible purchases are covered by our refund guarantee. Review terms for details.
          </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.termsLink}>Terms & Conditions Apply</Text>
          </TouchableOpacity>
        </View>

        <Button
          variant="primary"
          fullWidth
          onPress={handlePayNow}
          style={styles.payButton}
          disabled={!canPay}
        >
          Pay Now
        </Button>
      </ScrollView>
    </View>
  );
};

export default Payment;

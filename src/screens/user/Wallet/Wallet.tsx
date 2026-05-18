import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from '../../../components';
import { getMyWalletApi, type WalletTransaction } from '../../../api/walletApi';
import { colors } from '../../../theme';
import { styles } from './styles';

type StackParamList = {
  WalletMain: undefined;
  WalletEnterAmount: { mode: 'topup' };
  Payment: {
    amount: number;
    description: string;
    isWalletTopUp: boolean;
  };
};

const formatPkr = (n: number) =>
  `PKR ${n.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function transactionTitle(t: WalletTransaction): string {
  if (t.kind === 'topup') return 'Wallet top-up';
  if (t.kind === 'pay_to_wallet' && t.counterpartyName) {
    return `From ${t.counterpartyName}`;
  }
  if (t.kind === 'pay_to_wallet_sent' && t.counterpartyName) {
    return `Paid to ${t.counterpartyName}`;
  }
  return t.description;
}

const Wallet = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getMyWalletApi();
      setBalance(data.balance);
      setTransactions(data.transactions);
    } catch {
      setBalance(0);
      setTransactions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Wallet balance</Text>
          <Text style={styles.balanceValue}>{formatPkr(balance)}</Text>
          <Button
            variant="primary"
            fullWidth
            onPress={() => navigation.navigate('WalletEnterAmount', { mode: 'topup' })}
            style={styles.topUpBtn}
          >
            Top up
          </Button>
        </View>

        <Text style={styles.sectionTitle}>Activity</Text>
        {transactions.length === 0 ? (
          <Text style={styles.emptyText}>No wallet activity yet.</Text>
        ) : (
          transactions.map((t) => (
            <View key={t._id} style={styles.txCard}>
              <View style={styles.txIconWrap}>
                <Icon
                  name={t.type === 'credit' ? 'arrow-downward' : 'arrow-upward'}
                  size={20}
                  color={t.type === 'credit' ? colors.successGreen : colors.errorRed}
                />
              </View>
              <View style={styles.txContent}>
                <Text style={styles.txTitle}>{transactionTitle(t)}</Text>
                {t.eventTitle ? (
                  <Text style={styles.txMeta}>Event: {t.eventTitle}</Text>
                ) : null}
                <Text style={styles.txDate}>
                  {new Date(t.createdAt).toLocaleString()}
                </Text>
              </View>
              <Text
                style={[
                  styles.txAmount,
                  t.type === 'credit' ? styles.txAmountCredit : styles.txAmountDebit,
                ]}
              >
                {t.type === 'credit' ? '+' : '-'}
                {formatPkr(t.amount)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default Wallet;

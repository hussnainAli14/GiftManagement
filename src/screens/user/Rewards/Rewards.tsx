import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getMyRewardsApi, type RewardTransaction } from '../../../api/rewardApi';
import { colors } from '../../../theme';
import { styles } from './styles';

const Rewards = () => {
  const [balance, setBalance] = useState(0);
  const [rewardPercent, setRewardPercent] = useState(5);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [maxDiscountPercent, setMaxDiscountPercent] = useState(50);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<RewardTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getMyRewardsApi();
      setBalance(data.balance ?? 0);
      setRewardPercent(data.rewardPercent ?? 5);
      setDiscountPercent(data.discountPercent ?? 0);
      setMaxDiscountPercent(data.maxDiscountPercent ?? 50);
      setCouponCode(data.couponCode ?? null);
      setTransactions(data.transactions ?? []);
    } catch {
      setBalance(0);
      setDiscountPercent(0);
      setCouponCode(null);
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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Reward Points</Text>
          <Text style={styles.balanceValue}>{balance.toLocaleString()}</Text>
          <Text style={styles.hint}>
            Earn {rewardPercent}% of every purchase as reward points.
          </Text>
          <Text style={styles.hint}>
            {discountPercent > 0
              ? `Checkout coupon ${couponCode}: ${discountPercent}% off (max ${maxDiscountPercent}%).`
              : `Every 20 points unlocks 1% checkout discount (max ${maxDiscountPercent}%).`}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Points History</Text>
        {transactions.length === 0 ? (
          <Text style={styles.emptyText}>No reward points yet. Place an order to earn points.</Text>
        ) : (
          transactions.map((t) => (
            <View key={t._id} style={styles.txCard}>
              <View style={styles.txIconWrap}>
                <Icon
                  name={t.type === 'redeem' ? 'local-offer' : 'stars'}
                  size={20}
                  color={colors.primary}
                />
              </View>
              <View style={styles.txContent}>
                <Text style={styles.txTitle}>{t.description}</Text>
                <Text style={styles.txDate}>
                  {new Date(t.createdAt).toLocaleString()}
                </Text>
              </View>
              <Text
                style={[
                  styles.txAmount,
                  t.type === 'redeem' ? styles.txAmountDebit : styles.txAmountCredit,
                ]}
              >
                {t.type === 'redeem' ? '-' : '+'}
                {t.points}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default Rewards;

import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  deleteVendorExpenseApi,
  getVendorAnalyticsApi,
  type VendorAnalytics,
  type VendorAnalyticsProduct,
  type VendorExpense,
} from '../../../api/vendorApi';
import { colors } from '../../../theme';
import { styles, CHART_HEIGHT } from './styles';

const REPORT_BLUE = '#2563EB';
const EXPENSE_GRAY = '#6B7280';
const PROFIT_GREEN = '#16A34A';
const CHART_LABEL_COLOR = '#666666';

const CATEGORY_LABELS: Record<string, string> = {
  inventory: 'Inventory',
  shipping: 'Shipping',
  rent: 'Rent',
  utilities: 'Utilities',
  marketing: 'Marketing',
  salaries: 'Salaries',
  other: 'Other',
};

const chartConfigBase = {
  backgroundColor: 'transparent',
  backgroundGradientFrom: '#FFFFFF',
  backgroundGradientTo: '#FFFFFF',
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
  labelColor: () => CHART_LABEL_COLOR,
  decimalPlaces: 0,
  propsForBackgroundLines: { strokeDasharray: '', stroke: '#E0E0E0', strokeWidth: 0.5 },
};

function formatPkr(n: number): string {
  const num = Number.isFinite(n) ? n : 0;
  return `PKR ${Math.round(num).toLocaleString('en-PK')}`;
}

function formatCompact(n: number): string {
  const num = Number.isFinite(n) ? n : 0;
  const abs = Math.abs(num);
  if (abs >= 1_000_000) return `PKR ${(num / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `PKR ${(num / 1_000).toFixed(1)}K`;
  return `PKR ${Math.round(num)}`;
}

function ProductHighlightCard({
  title,
  badge,
  product,
  accent,
}: {
  title: string;
  badge: string;
  product: VendorAnalyticsProduct | null;
  accent: string;
}) {
  return (
    <View style={styles.productCard}>
      <View style={styles.productCardHeader}>
        <View style={[styles.productBadge, { backgroundColor: accent }]}>
          <Text style={styles.productBadgeText}>{badge}</Text>
        </View>
        <Text style={styles.productCardTitle}>{title}</Text>
      </View>
      {product ? (
        <View style={styles.productBody}>
          {product.image ? (
            <Image source={{ uri: product.image }} style={styles.productImage} />
          ) : (
            <View style={[styles.productImage, styles.productImagePlaceholder]}>
              <Icon name="inventory-2" size={28} color={colors.darkGray} />
            </View>
          )}
          <View style={styles.productMeta}>
            <Text style={styles.productName} numberOfLines={2}>
              {product.name || 'Product'}
            </Text>
            <Text style={styles.productStat}>
              {product.unitsSold} sold · {formatPkr(product.revenue)}
            </Text>
          </View>
        </View>
      ) : (
        <Text style={styles.emptyProduct}>No sales in this period yet.</Text>
      )}
    </View>
  );
}

type ReportsStackParamList = {
  ReportsMain: undefined;
  AddExpense: undefined;
};

const Reports = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ReportsStackParamList>>();
  const screenWidth = Dimensions.get('window').width;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<VendorAnalytics | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await getVendorAnalyticsApi(6);
      setAnalytics(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load analytics.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const pnl = useMemo(() => {
    const s = analytics?.summaries;
    return {
      sales: s?.totalSales ?? s?.totalRevenue ?? 0,
      expenses: s?.totalExpenses ?? 0,
      profit: s?.profit ?? 0,
    };
  }, [analytics]);

  const lineChartData = useMemo(() => {
    const labels = analytics?.monthlySales?.months || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const sales =
      analytics?.monthlySales?.values?.map((v) => Number(v) || 0) || labels.map(() => 0);
    const expenses =
      analytics?.monthlyExpenses?.values?.map((v) => Number(v) || 0) || labels.map(() => 0);
    while (sales.length < labels.length) sales.push(0);
    while (expenses.length < labels.length) expenses.push(0);
    return {
      labels,
      datasets: [
        {
          data: sales.slice(0, labels.length),
          color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
          strokeWidth: 2,
        },
        {
          data: expenses.slice(0, labels.length),
          color: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
          strokeWidth: 2,
        },
      ],
      legend: ['Sales', 'Expenses'],
    };
  }, [analytics]);

  const handleDeleteExpense = (expense: VendorExpense) => {
    Alert.alert('Delete expense?', `${formatPkr(expense.amount)} will be removed.`, [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteVendorExpenseApi(expense._id);
            await load(true);
          } catch (e) {
            Alert.alert('Could not delete', e instanceof Error ? e.message : 'Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.primary} />
        }
      >
        {loading ? (
          <View style={{ paddingVertical: 18, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ marginTop: 10, color: colors.textSecondary }}>Loading analytics…</Text>
          </View>
        ) : null}
        {error ? (
          <View style={{ paddingVertical: 10 }}>
            <Text style={{ color: colors.errorRed, textAlign: 'center' }}>{error}</Text>
          </View>
        ) : null}

        {!loading ? (
          <>
            <Text style={styles.sectionTitle}>Profit & Loss (last 6 months)</Text>
            <View style={styles.pnlCard}>
              <View style={styles.pnlRow}>
                <Text style={styles.pnlLabel}>Sales</Text>
                <Text style={[styles.pnlValue, { color: REPORT_BLUE }]}>{formatPkr(pnl.sales)}</Text>
              </View>
              <View style={styles.pnlRow}>
                <Text style={styles.pnlLabel}>Expenses</Text>
                <Text style={[styles.pnlValue, { color: EXPENSE_GRAY }]}>
                  {formatPkr(pnl.expenses)}
                </Text>
              </View>
              <View style={styles.pnlDivider} />
              <View style={styles.pnlRow}>
                <Text style={styles.pnlProfitLabel}>Profit</Text>
                <Text
                  style={[
                    styles.pnlProfitValue,
                    { color: pnl.profit >= 0 ? PROFIT_GREEN : colors.errorRed },
                  ]}
                >
                  {formatPkr(pnl.profit)}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.addExpenseButton}
              onPress={() => navigation.navigate('AddExpense')}
              activeOpacity={0.8}
            >
              <Icon name="add-circle-outline" size={20} color={colors.white} />
              <Text style={styles.addExpenseButtonText}>Add expense</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Monthly Sales & Expenses</Text>
            <View style={[styles.chartSection, styles.chartWrapper]}>
              <LineChart
                data={lineChartData}
                width={screenWidth - 32}
                height={CHART_HEIGHT}
                chartConfig={chartConfigBase}
                bezier
                withDots
                withInnerLines
                withOuterLines={false}
                withVerticalLabels
                withHorizontalLabels
                fromZero
                style={{ marginVertical: 8, borderRadius: 0 }}
                withVerticalLines={false}
                withHorizontalLines
                formatYLabel={(v) => formatCompact(Number(v)).replace('PKR ', '')}
              />
              <View style={styles.chartLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: REPORT_BLUE }]} />
                  <Text style={styles.legendText}>Sales</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: EXPENSE_GRAY }]} />
                  <Text style={styles.legendText}>Expenses</Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Recent Expenses</Text>
            {(analytics?.recentExpenses || []).length === 0 ? (
              <Text style={styles.emptyProduct}>No expenses recorded yet. Tap Add expense to start.</Text>
            ) : (
              (analytics?.recentExpenses || []).map((expense) => (
                <View key={expense._id} style={styles.expenseRow}>
                  <View style={styles.expenseMeta}>
                    <Text style={styles.expenseCategory}>
                      {CATEGORY_LABELS[expense.category] || expense.category}
                    </Text>
                    <Text style={styles.expenseNote} numberOfLines={1}>
                      {expense.note ||
                        new Date(expense.incurredAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                    </Text>
                  </View>
                  <Text style={styles.expenseAmount}>{formatPkr(expense.amount)}</Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteExpense(expense)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Icon name="delete-outline" size={22} color={colors.errorRed} />
                  </TouchableOpacity>
                </View>
              ))
            )}

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Most Sold Product</Text>
            <ProductHighlightCard
              title="Highest units sold"
              badge="Top seller"
              product={analytics?.mostSoldProduct ?? null}
              accent="#16A34A"
            />

            <Text style={styles.sectionTitle}>Highest Revenue Product</Text>
            <ProductHighlightCard
              title="Most revenue earned"
              badge="Top earner"
              product={analytics?.highestRevenueProduct ?? null}
              accent="#EA580C"
            />
          </>
        ) : null}
      </ScrollView>
    </View>
  );
};

export default Reports;

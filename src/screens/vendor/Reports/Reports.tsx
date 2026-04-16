import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getReportsOverviewApi, type ReportsOverview } from '../../../api/reportsApi';
import { colors } from '../../../theme';
import {
  styles,
  CHART_HEIGHT,
  DONUT_SIZE,
  DONUT_CENTER_RADIUS,
} from './styles';

const REPORT_BLUE = '#2563EB';
const CHART_LABEL_COLOR = '#666666';

const chartConfigBase = {
  backgroundColor: 'transparent',
  backgroundGradientFrom: '#FFFFFF',
  backgroundGradientTo: '#FFFFFF',
  backgroundGradientToOpacity: 0,
  color: () => CHART_LABEL_COLOR,
  labelColor: () => CHART_LABEL_COLOR,
  decimalPlaces: 0,
  propsForBackgroundLines: { strokeDasharray: '', stroke: '#E0E0E0', strokeWidth: 0.5 },
};

function formatCompact(n: number, prefix = ''): string {
  const num = Number.isFinite(n) ? n : 0;
  const abs = Math.abs(num);
  if (abs >= 1_000_000) return `${prefix}${(num / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${prefix}${(num / 1_000).toFixed(1)}K`;
  return `${prefix}${Math.round(num)}`;
}

function clampArr(arr: number[] | undefined, len: number): number[] {
  const a = Array.isArray(arr) ? arr : [];
  if (a.length === len) return a;
  if (a.length > len) return a.slice(0, len);
  return [...a, ...Array.from({ length: len - a.length }, () => 0)];
}

const Reports = () => {
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get('window').width;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<ReportsOverview | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getReportsOverviewApi(6);
        if (!cancelled) setOverview(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load reports.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const summaryCards = useMemo(() => {
    const s = overview?.summaries;
    return [
      { label: 'Total Sales', value: s ? `PKR ${formatCompact(s.totalSales)}` : '—', trend: '', up: true },
      { label: 'New Users', value: s ? formatCompact(s.newUsers) : '—', trend: '', up: true },
      { label: 'Vendor Approvals', value: s ? String(s.vendorApprovals) : '—', trend: '', up: true },
      { label: 'Pending Orders', value: s ? String(s.pendingOrders) : '—', trend: '', up: false },
    ];
  }, [overview]);

  const lineChartData = useMemo(() => {
    const labels = overview?.charts?.months || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const sales = clampArr(overview?.charts?.monthlySales, labels.length);
    const expenses = clampArr(overview?.charts?.monthlyExpenses, labels.length);
    return {
      labels,
      datasets: [
        {
          data: sales,
          color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
          strokeWidth: 2,
        },
        {
          data: expenses,
          color: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
          strokeWidth: 2,
        },
      ],
      legend: ['Sales (PKR)', 'Expenses (PKR)'],
    };
  }, [overview]);

  const barChartData = useMemo(() => {
    const labels = overview?.charts?.months || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const data = clampArr(overview?.charts?.userGrowth, labels.length);
    return { labels, datasets: [{ data }] };
  }, [overview]);

  const pieData = useMemo(() => {
    const top = overview?.charts?.topVendors || [];
    const colorsList = ['#1F2937', '#EA580C', REPORT_BLUE];
    const normalized = top.slice(0, 3).map((v, idx) => ({
      name: v.name || `Vendor ${idx + 1}`,
      value: Number(v.value || 0),
      color: colorsList[idx] || REPORT_BLUE,
      legendFontColor: CHART_LABEL_COLOR,
      legendFontSize: 12,
    }));
    if (normalized.length) return normalized;
    return [
      { name: '—', value: 1, color: '#E5E7EB', legendFontColor: CHART_LABEL_COLOR, legendFontSize: 12 },
    ];
  }, [overview]);

  const handleExport = () => {
    // TODO: Export reports
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={{ paddingVertical: 18, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ marginTop: 10, color: colors.textSecondary }}>Loading reports…</Text>
          </View>
        ) : null}
        {error ? (
          <View style={{ paddingVertical: 10 }}>
            <Text style={{ color: colors.errorRed, textAlign: 'center' }}>{error}</Text>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>Overall Summaries</Text>
        <View style={styles.summaryGrid}>
          {summaryCards.map((card, index) => (
            <View key={index} style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{card.label}</Text>
              <Text style={styles.summaryValue}>{card.value}</Text>
              {card.trend ? (
                <Text style={card.up ? styles.trendUp : styles.trendDown}>
                  {card.up ? '↑ ' : '↓ '}
                  {card.trend}
                </Text>
              ) : null}
            </View>
          ))}
        </View>

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
          />
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: REPORT_BLUE }]} />
              <Text style={styles.legendText}>Sales (PKR)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#6B7280' }]} />
              <Text style={styles.legendText}>Expenses (PKR)</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>User Growth Over Time</Text>
        <View style={[styles.chartSection, styles.chartWrapper]}>
          <BarChart
            data={barChartData}
            width={screenWidth - 32}
            height={CHART_HEIGHT}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              ...chartConfigBase,
              color: (opacity = 1) => `rgba(220, 38, 38, ${opacity})`,
            }}
            fromZero
            style={{ marginVertical: 8, borderRadius: 0 }}
            withInnerLines={false}
            barRadius={4}
          />
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#DC2626' }]} />
              <Text style={styles.legendText}>New Users</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Top Vendor Contributions</Text>
        <View style={[styles.chartSection, styles.chartWrapper]}>
          <View style={styles.donutWrapper}>
            <PieChart
              data={pieData}
              width={DONUT_SIZE}
              height={DONUT_SIZE}
              chartConfig={chartConfigBase}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft="0"
              center={[DONUT_SIZE / 2, DONUT_SIZE / 2]}
              absolute
              hasLegend={false}
            />
            <View
              style={[
                styles.donutCenterCircle,
                {
                  width: DONUT_CENTER_RADIUS * 2,
                  height: DONUT_CENTER_RADIUS * 2,
                  left: DONUT_SIZE / 4 + DONUT_SIZE / 2 - DONUT_CENTER_RADIUS,
                  top: DONUT_SIZE / 2 - DONUT_CENTER_RADIUS,
                },
              ]}
            />
          </View>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#EA580C' }]} />
              <Text style={styles.legendText}>Vendor B</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: REPORT_BLUE }]} />
              <Text style={styles.legendText}>Vendor C</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#1F2937' }]} />
              <Text style={styles.legendText}>Vendor A</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.exportButton, { marginBottom: insets.bottom + 24 }]}
          onPress={handleExport}
          activeOpacity={0.8}
        >
          <Icon name="assessment" size={22} color="#FFFFFF" />
          <Text style={styles.exportButtonText}>Export All Reports</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Reports;

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

const lineChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      data: [1900, 2300, 1700, 2700, 2900, 3000],
      color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
      strokeWidth: 2,
    },
    {
      data: [1200, 1500, 1100, 1600, 1800, 2000],
      color: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
      strokeWidth: 2,
    },
  ],
  legend: ['Sales (PKR)', 'Expenses (PKR)'],
};

const barChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{ data: [120, 180, 130, 230, 160, 200] }],
};

const pieData = [
  { name: 'Vendor A', value: 45, color: '#1F2937', legendFontColor: CHART_LABEL_COLOR, legendFontSize: 12 },
  { name: 'Vendor B', value: 30, color: '#EA580C', legendFontColor: CHART_LABEL_COLOR, legendFontSize: 12 },
  { name: 'Vendor C', value: 25, color: REPORT_BLUE, legendFontColor: CHART_LABEL_COLOR, legendFontSize: 12 },
];

const summaryCards = [
  { label: 'Total Sales', value: 'PKR 12.5K', trend: '+12.3%', up: true },
  { label: 'New Users', value: '1.8K', trend: '+8.5%', up: true },
  { label: 'Vendor Approvals', value: '55', trend: '+15.0%', up: true },
  { label: 'Pending Orders', value: '230', trend: '-2.1%', up: false },
];

const Reports = () => {
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get('window').width;

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
        <Text style={styles.sectionTitle}>Overall Summaries</Text>
        <View style={styles.summaryGrid}>
          {summaryCards.map((card, index) => (
            <View key={index} style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{card.label}</Text>
              <Text style={styles.summaryValue}>{card.value}</Text>
              <Text style={card.up ? styles.trendUp : styles.trendDown}>
                {card.up ? '↑ ' : '↓ '}{card.trend}
              </Text>
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

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getVendorDashboardStatsApi, type VendorDashboardStats } from '../../../api/vendorApi';
import { useAuth } from '../../../context/AuthContext';
import { colors } from '../../../theme';
import { styles } from './styles';

type VendorTabParamList = {
  Dashboard: undefined;
  Users: undefined;
  Vendors: undefined;
  Orders: undefined;
  Reports: undefined;
};

type DashboardStackParamList = {
  DashboardMain: undefined;
  AddProduct: undefined;
  MyProducts: undefined;
};

function formatCurrency(amount: number): string {
  const n = Number(amount || 0);
  if (Number.isNaN(n)) return 'PKR 0';
  return `PKR ${Math.round(n).toLocaleString()}`;
}

type DashboardNavProp = CompositeNavigationProp<
  NativeStackNavigationProp<DashboardStackParamList, 'DashboardMain'>,
  BottomTabNavigationProp<VendorTabParamList, 'Dashboard'>
>;

const Dashboard = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DashboardNavProp>();
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState<VendorDashboardStats | null>(null);
  const [error, setError] = React.useState<string>('');

  const load = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const s = await getVendorDashboardStatsApi();
      setStats(s);
    } catch (e) {
      setStats(null);
      setError(e instanceof Error ? e.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.welcomeTitle}>Welcome Back, {user?.name || 'Vendor'}!</Text>
        <Text style={styles.welcomeSubtitle}>Here&apos;s your dashboard summary.</Text>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : error ? (
          <TouchableOpacity style={styles.errorCard} activeOpacity={0.8} onPress={load}>
            <Text style={styles.errorTitle}>Couldn&apos;t load dashboard</Text>
            <Text style={styles.errorBody}>{error}</Text>
            <Text style={styles.errorHint}>Tap to retry</Text>
          </TouchableOpacity>
        ) : (
          <>
            <View style={styles.cardsRow}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Orders</Text>
                <Text style={styles.cardValue}>{stats?.pendingOrders ?? 0} Pending</Text>
                <Text style={styles.trendNeutral}>Live</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Earnings</Text>
                <Text style={styles.cardValue}>{formatCurrency(stats?.totalSales ?? 0)}</Text>
                <Text style={styles.trendNeutral}>Lifetime</Text>
              </View>
            </View>
            <View style={styles.cardsRow}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Products</Text>
                <Text style={styles.cardValue}>{stats?.productCount ?? 0} Active</Text>
                <Text style={styles.trendNeutral}>Live</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Customers</Text>
                <Text style={styles.cardValue}>{stats?.customerCount ?? 0} Total</Text>
                <Text style={styles.trendNeutral}>Unique buyers</Text>
              </View>
            </View>
          </>
        )}

        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonInner]}
          onPress={() => navigation.navigate('AddProduct')}
          activeOpacity={0.8}
        >
          <Icon name="add" size={22} color={colors.white} style={styles.buttonIcon} />
          <Text style={styles.actionButtonText}>Add New Product</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonInner]}
          onPress={() => navigation.navigate('MyProducts')}
          activeOpacity={0.8}
        >
          <Icon name="inventory-2" size={22} color={colors.white} style={styles.buttonIcon} />
          <Text style={styles.actionButtonText}>View All Products</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonInner]}
          onPress={() => navigation.navigate('Orders')}
          activeOpacity={0.8}
        >
          <Icon name="list-alt" size={22} color={colors.white} style={styles.buttonIcon} />
          <Text style={styles.actionButtonText}>View All Orders</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Dashboard;

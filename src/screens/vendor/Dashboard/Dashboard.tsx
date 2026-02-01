import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
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

const summaryCards = [
  {
    title: 'Orders',
    value: '45 New Orders',
    trend: '↑ 8% Up',
    trendUp: true,
  },
  {
    title: 'Earnings',
    value: '$3,450',
    trend: '↓ 5% Down',
    trendUp: false,
  },
  {
    title: 'Products',
    value: '128 Active Products',
    trend: '↑ 2% Up',
    trendUp: true,
  },
  {
    title: 'Customers',
    value: '90 Total',
    trend: '↑ 12% Up',
    trendUp: true,
  },
];

type DashboardNavProp = CompositeNavigationProp<
  NativeStackNavigationProp<DashboardStackParamList, 'DashboardMain'>,
  BottomTabNavigationProp<VendorTabParamList, 'Dashboard'>
>;

const Dashboard = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DashboardNavProp>();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.welcomeTitle}>Welcome Back, Vendor!</Text>
        <Text style={styles.welcomeSubtitle}>Here&apos;s your dashboard summary.</Text>

        <View style={styles.cardsRow}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{summaryCards[0].title}</Text>
            <Text style={styles.cardValue}>{summaryCards[0].value}</Text>
            <Text style={summaryCards[0].trendUp ? styles.trendUp : styles.trendDown}>
              {summaryCards[0].trend}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{summaryCards[1].title}</Text>
            <Text style={styles.cardValue}>{summaryCards[1].value}</Text>
            <Text style={summaryCards[1].trendUp ? styles.trendUp : styles.trendDown}>
              {summaryCards[1].trend}
            </Text>
          </View>
        </View>
        <View style={styles.cardsRow}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{summaryCards[2].title}</Text>
            <Text style={styles.cardValue}>{summaryCards[2].value}</Text>
            <Text style={summaryCards[2].trendUp ? styles.trendUp : styles.trendDown}>
              {summaryCards[2].trend}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{summaryCards[3].title}</Text>
            <Text style={styles.cardValue}>{summaryCards[3].value}</Text>
            <Text style={summaryCards[3].trendUp ? styles.trendUp : styles.trendDown}>
              {summaryCards[3].trend}
            </Text>
          </View>
        </View>

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

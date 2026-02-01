import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { VendorBottomTabBar } from '../components';
import {
  Dashboard,
  AddProduct,
  MyProducts,
  EditProduct,
  Users,
  Vendors,
  Orders,
  OrderDetails,
  Reports,
} from '../screens/vendor';
import { getDefaultHeaderOptions, getHeaderBackButton } from './headerConfig';
import { typography } from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const VendorTabBar = (props: BottomTabBarProps) => <VendorBottomTabBar {...props} />;

const renderDashboardIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="home" size={size} color={color} />
);
const renderUsersIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="people" size={size} color={color} />
);
const renderVendorsIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="store" size={size} color={color} />
);
const renderOrdersIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="shopping-cart" size={size} color={color} />
);
const renderReportsIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="bar-chart" size={size} color={color} />
);

const MarketConnectHeaderLeft = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 4 }}>
    <Icon name="store" size={24} color="#000000" style={{ marginRight: 8 }} />
    <Text style={[typography.textStyles.h4, { color: '#000000' }]}>MarketConnect</Text>
  </View>
);

const MarketConnectHeaderRight = () => (
  <TouchableOpacity style={{ marginRight: 16 }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
    <Icon name="person-outline" size={24} color="#000000" />
  </TouchableOpacity>
);

const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="DashboardMain"
      component={Dashboard}
      options={{
        headerShown: true,
        headerTitle: '',
        headerLeft: () => <MarketConnectHeaderLeft />,
        headerRight: () => <MarketConnectHeaderRight />,
        ...getDefaultHeaderOptions(),
      }}
    />
    <Stack.Screen
      name="AddProduct"
      component={AddProduct}
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: 'Add Product',
        ...getDefaultHeaderOptions(),
        headerLeft: getHeaderBackButton(navigation),
      })}
    />
    <Stack.Screen
      name="MyProducts"
      component={MyProducts}
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: 'My Products',
        ...getDefaultHeaderOptions(),
        headerLeft: getHeaderBackButton(navigation),
        headerRight: () => (
          <TouchableOpacity style={{ marginRight: 16 }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon name="more-vert" size={24} color="#000000" />
          </TouchableOpacity>
        ),
      })}
    />
    <Stack.Screen
      name="EditProduct"
      component={EditProduct}
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: 'Edit Product',
        ...getDefaultHeaderOptions(),
        headerLeft: getHeaderBackButton(navigation),
      })}
    />
  </Stack.Navigator>
);

const UsersStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="UsersMain"
      component={Users}
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: 'User Management',
        ...getDefaultHeaderOptions(),
        headerRight: () => (
          <TouchableOpacity style={{ marginRight: 16 }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon name="search" size={24} color="#000000" />
          </TouchableOpacity>
        ),
      })}
    />
  </Stack.Navigator>
);

const VendorsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="VendorsMain"
      component={Vendors}
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: 'Vendor Approval',
        ...getDefaultHeaderOptions(),
        headerLeft: getHeaderBackButton(navigation),
        headerRight: () => (
          <TouchableOpacity style={{ marginRight: 16 }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon name="filter-list" size={24} color="#000000" />
          </TouchableOpacity>
        ),
      })}
    />
  </Stack.Navigator>
);

const OrdersStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="OrdersMain"
      component={Orders}
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: 'Vendor Orders',
        ...getDefaultHeaderOptions(),
        headerLeft: getHeaderBackButton(navigation),
        headerRight: () => (
          <TouchableOpacity style={{ marginRight: 16 }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon name="more-vert" size={24} color="#000000" />
          </TouchableOpacity>
        ),
      })}
    />
    <Stack.Screen
      name="OrderDetails"
      component={OrderDetails}
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: 'Order Details',
        ...getDefaultHeaderOptions(),
        headerLeft: getHeaderBackButton(navigation),
      })}
    />
  </Stack.Navigator>
);

const ReportsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="ReportsMain"
      component={Reports}
      options={{
        headerShown: true,
        headerTitle: 'Reports',
        ...getDefaultHeaderOptions(),
        headerRight: () => (
          <TouchableOpacity style={{ marginRight: 16 }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon name="filter-list" size={24} color="#000000" />
          </TouchableOpacity>
        ),
      }}
    />
  </Stack.Navigator>
);

const VendorNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={VendorTabBar}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: renderDashboardIcon,
        }}
      />
      <Tab.Screen
        name="Users"
        component={UsersStack}
        options={{
          tabBarLabel: 'Users',
          tabBarIcon: renderUsersIcon,
        }}
      />
      <Tab.Screen
        name="Vendors"
        component={VendorsStack}
        options={{
          tabBarLabel: 'Vendors',
          tabBarIcon: renderVendorsIcon,
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersStack}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: renderOrdersIcon,
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsStack}
        options={{
          tabBarLabel: 'Reports',
          tabBarIcon: renderReportsIcon,
        }}
      />
    </Tab.Navigator>
  );
};

export default VendorNavigator;

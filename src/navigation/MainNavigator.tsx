import React from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BottomTabBar } from '../components';
import {
  Home,
  Events,
  Friends,
  Notifications,
  FriendProfile,
  AddFriends,
  CreateEventStep1,
  CreateEventStep2,
  WishlistDetail,
  AddItem,
  EditItem,
  PersonsWishlist,
  GiftOptions,
  SelectVendor,
  ConfirmOrder,
  Payment,
  OrderConfirmed,
  ContributionProgress,
  ContributionSuccess,
  MyOrders,
  OrderDetail,
  Profile,
  ChangePassword,
  MyProfile,
  EditMyProfile,
  PrivacyPolicy,
  TermsOfService,
  MessagesInbox,
  NewChat,
  ChatThread,
} from '../screens/user';
import type { ChatThreadParams } from './messagingParams';
import { getDefaultHeaderOptions, getHeaderBackButton } from './headerConfig';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Custom tab bar wrapper component
const CustomTabBar = (props: BottomTabBarProps) => <BottomTabBar {...props} />;

// Icon renderers defined outside to avoid re-creation warnings
const renderHomeIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="home" size={size} color={color} />
);

const renderEventsIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="event" size={size} color={color} />
);

// Events Stack Navigator - Events screen with navigation header + Create Event flow
const EventsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="EventsMain"
        component={Events}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'My Events',
          ...getDefaultHeaderOptions(),
          headerRight: () => (
            <TouchableOpacity
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
              }}
              onPress={() => navigation.navigate('CreateEventStep1')}
            >
              <Icon name="add" size={24} color={colors.white} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="CreateEventStep1"
        component={CreateEventStep1}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Create Event (1/2)',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="CreateEventStep2"
        component={CreateEventStep2}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Create Wishlist',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="WishlistDetail"
        component={WishlistDetail}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerTitle: (route.params as { wishlistName?: string })?.wishlistName ?? 'Birthday Wishlist',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                const eventId = (route.params as { eventId?: string })?.eventId;
                Alert.alert('Add Item', 'Where do you want to add this item?', [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Wishlist',
                    onPress: () => navigation.navigate('AddItem', { eventId, listType: 'wishlist' }),
                  },
                  {
                    text: 'Non Wishlist',
                    onPress: () => navigation.navigate('AddItem', { eventId, listType: 'nonWishlist' }),
                  },
                ]);
              }}
              style={{ marginRight: 16 }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="add" size={24} color="#000000" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="AddItem"
        component={AddItem}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Add Item',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                // TODO: Save item and go back
                if (navigation.canGoBack()) navigation.goBack();
              }}
              style={{ marginRight: 16 }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="save" size={24} color="#000000" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="EditItem"
        component={EditItem}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Edit Item',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                // TODO: Save changes and go back (same as Update Item)
                if (navigation.canGoBack()) navigation.goBack();
              }}
              style={{ marginRight: 16 }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="save" size={24} color="#000000" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="PersonsWishlist"
        component={PersonsWishlist}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerTitle: (route.params as { eventTitle?: string })?.eventTitle ?? "Person's wishlist",
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                // TODO: Share wishlist
              }}
              style={{ marginRight: 16 }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="share" size={24} color="#000000" />
            </TouchableOpacity>
          ),
          tabBarStyle: { display: 'none' },
        })}
      />
      <Stack.Screen
        name="GiftOptions"
        component={GiftOptions}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Gift Options',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="SelectVendor"
        component={SelectVendor}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Select Vendor',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="ConfirmOrder"
        component={ConfirmOrder}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Confirm Order',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="Payment"
        component={Payment}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Payment',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="OrderConfirmed"
        component={OrderConfirmed}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Order Confirmed',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="MyOrders"
        component={MyOrders}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'My Orders',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerTitle: `Order #${(route.params as { order?: { id: string } })?.order?.id ?? ''}`,
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 16, gap: 12 }}>
              <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Icon name="call" size={24} color="#000000" />
              </TouchableOpacity>
              <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Icon name="videocam" size={24} color="#000000" />
              </TouchableOpacity>
              <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Icon name="info-outline" size={24} color="#000000" />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="ContributionSuccess"
        component={ContributionSuccess}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Contribution Success',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
    </Stack.Navigator>
  );
};

const renderFriendsIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="people" size={size} color={color} />
);

const renderProfileIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="person" size={size} color={color} />
);

// Home Stack Navigator - includes Home, Notifications, and PersonsWishlist screens
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={Home} />
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Notifications',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="MessagesInbox"
        component={MessagesInbox}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Messages',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('NewChat' as never)}
              style={{ marginRight: 16 }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="add" size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
          tabBarStyle: { display: 'none' },
        })}
      />
      <Stack.Screen
        name="NewChat"
        component={NewChat}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'New chat',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
          tabBarStyle: { display: 'none' },
        })}
      />
      <Stack.Screen
        name="ChatThread"
        component={ChatThread}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerTitle: (route.params as ChatThreadParams)?.peerName ?? 'Chat',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
          tabBarStyle: { display: 'none' },
        })}
      />
      <Stack.Screen
        name="PersonsWishlist"
        component={PersonsWishlist}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerTitle: (route.params as { eventTitle?: string })?.eventTitle ?? "Person's wishlist",
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                // TODO: Share wishlist
              }}
              style={{ marginRight: 16 }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="share" size={24} color="#000000" />
            </TouchableOpacity>
          ),
          tabBarStyle: { display: 'none' },
        })}
      />
      <Stack.Screen
        name="AddItem"
        component={AddItem}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Add Item',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="EditItem"
        component={EditItem}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Edit Item',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="GiftOptions"
        component={GiftOptions}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Gift Options',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="ContributionProgress"
        component={ContributionProgress}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Contribution Progress',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="SelectVendor"
        component={SelectVendor}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Select Vendor',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="ConfirmOrder"
        component={ConfirmOrder}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Confirm Order',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="Payment"
        component={Payment}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Payment',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="OrderConfirmed"
        component={OrderConfirmed}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Order Confirmed',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="MyOrders"
        component={MyOrders}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'My Orders',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerTitle: `Order #${(route.params as { order?: { id: string } })?.order?.id ?? ''}`,
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 16, gap: 12 }}>
              <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Icon name="call" size={24} color="#000000" />
              </TouchableOpacity>
              <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Icon name="videocam" size={24} color="#000000" />
              </TouchableOpacity>
              <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Icon name="info-outline" size={24} color="#000000" />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="ContributionSuccess"
        component={ContributionSuccess}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Contribution Success',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
    </Stack.Navigator>
  );
};

// Profile Stack Navigator - App Settings
const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={Profile}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'App Settings',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="MyProfile"
        component={MyProfile}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'My Profile',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="EditMyProfile"
        component={EditMyProfile}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Edit Profile',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Change Password',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Privacy Policy',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="TermsOfService"
        component={TermsOfService}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Terms of Service',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
    </Stack.Navigator>
  );
};

// Friends Stack Navigator - includes Friends, AddFriends, Notifications, and FriendProfile screens
const FriendsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="FriendsMain" component={Friends} />
      <Stack.Screen
        name="AddFriends"
        component={AddFriends}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Add friends',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Notifications',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="MessagesInbox"
        component={MessagesInbox}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Messages',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('NewChat' as never)}
              style={{ marginRight: 16 }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="add" size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
          tabBarStyle: { display: 'none' },
        })}
      />
      <Stack.Screen
        name="NewChat"
        component={NewChat}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'New chat',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
          tabBarStyle: { display: 'none' },
        })}
      />
      <Stack.Screen
        name="ChatThread"
        component={ChatThread}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerTitle: (route.params as ChatThreadParams)?.peerName ?? 'Chat',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
          tabBarStyle: { display: 'none' },
        })}
      />
      <Stack.Screen
        name="FriendProfile"
        component={FriendProfile}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerTitle: (route.params as any)?.friendName || 'Friend Profile',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 16, gap: 16 }}>
              <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Icon name="more-vert" size={24} color="#000000" />
              </TouchableOpacity>
              <TouchableOpacity
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={() => {
                  const p = route.params as {
                    friendId?: string;
                    friendName?: string;
                    friendAvatar?: string;
                  };
                  if (p?.friendId) {
                    navigation.navigate('ChatThread', {
                      peerUserId: p.friendId,
                      peerName: p.friendName ?? 'Chat',
                      peerAvatar: p.friendAvatar,
                    });
                  }
                }}
              >
                <Icon name="message" size={24} color="#000000" />
              </TouchableOpacity>
            </View>
          ),
          tabBarStyle: { display: 'none' },
        })}
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={CustomTabBar}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: renderHomeIcon,
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventsStack}
        options={{
          tabBarLabel: 'Events',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: renderEventsIcon,
        }}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsStack}
        options={{
          tabBarLabel: 'Friends',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: renderFriendsIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: renderProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;

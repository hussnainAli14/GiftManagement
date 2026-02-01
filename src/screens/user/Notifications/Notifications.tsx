import React from 'react';
import { View, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NotificationItem } from '../../../components';
import type { Notification } from '../../../components/NotificationItem';
import { styles } from './styles';

// Mock data - replace with real API data when integrating
const notifications: Notification[] = [
  {
    id: '1',
    title: 'Gift Received!',
    description: 'Sara just sent you a lovely surprise for your birthday wishlist. Check it out now!',
    timestamp: 'Just now',
    isUnread: true,
    avatar: 'https://i.pravatar.cc/150?img=1', // Using placeholder image service
  },
  {
    id: '2',
    title: 'Contribution Update',
    description: 'Your friends have contributed 5,000 PKR towards the "Ali\'s Birthday" event fund. Only 15,000 PKR more to go!',
    timestamp: '5 min ago',
    isUnread: true,
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    title: 'Order Delivered',
    description: 'The "Custom Mug" for Ali\'s Birthday party has been successfully delivered. Yay!',
    timestamp: '1 hour ago',
    isUnread: false,
    icon: 'gift',
  },
  {
    id: '4',
    title: 'App Update Available',
    description: 'Exciting new features and performance improvements are ready! Update your app to get the best experience.',
    timestamp: '2 days ago',
    isUnread: false,
    icon: 'bell',
  },
  {
    id: '5',
    title: 'New Pledge',
    description: 'Your cousin, Ali, just pledged 2,500 PKR towards your new gaming console on your wishlist.',
    timestamp: '3 days ago',
    isUnread: false,
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '6',
    title: 'Thank You for Your Gift!',
    description: 'Ali loved the book you sent for his birthday! He said it was exactly what he wanted.',
    timestamp: 'Last week',
    isUnread: false,
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
];

const Notifications = () => {
  const insets = useSafeAreaInsets();

  const handleNotificationPress = (notification: Notification) => {
    // Handle notification press - mark as read, navigate to details, etc.
    console.log('Notification pressed:', notification);
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <NotificationItem
      notification={item}
      onPress={handleNotificationPress}
    />
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Notifications;

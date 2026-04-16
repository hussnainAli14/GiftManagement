import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NotificationItem } from '../../../components';
import type { Notification } from '../../../components/NotificationItem';
import {
  getNotificationsApi,
  markAllNotificationsReadApi,
  markNotificationReadApi,
  type BackendNotification,
} from '../../../api/notificationApi';
import { useAuth } from '../../../context/AuthContext';
import { useNotificationBadge } from '../../../context/NotificationBadgeContext';
import { styles } from './styles';

type Nav = NativeStackNavigationProp<any>;

const Notifications = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { refresh: refreshBadge } = useNotificationBadge();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [raw, setRaw] = useState<BackendNotification[]>([]);

  const mapToUi = useCallback((result: BackendNotification[]) => {
    setRaw(result);
    setNotifications(
      result.map((item) => ({
        id: item._id,
        title: item.title,
        description: item.message,
        timestamp: new Date(item.createdAt).toLocaleString(),
        isUnread: !item.read,
        icon: item.type === 'order' ? 'order' : item.type === 'gift' ? 'gift' : 'bell',
      }))
    );
  }, []);

  const load = useCallback(async () => {
    if (!user?.id) return;
    try {
      const result = await getNotificationsApi(user.id);
      mapToUi(result);
    } catch {
      setRaw([]);
      setNotifications([]);
    }
  }, [user?.id, mapToUi]);

  useEffect(() => {
    load();
  }, [load]);

  const byId = useMemo(() => new Map(raw.map((n) => [n._id, n])), [raw]);

  const goTab = (tabName: string, screenName?: string, params?: any) => {
    const parent = navigation.getParent();
    if (parent && screenName) {
      parent.navigate(tabName as never, { screen: screenName, params } as never);
      return;
    }
    if (parent) {
      parent.navigate(tabName as never);
      return;
    }
    if (screenName) {
      navigation.navigate(screenName as never, params as never);
    }
  };

  const navigateFrom = (n: BackendNotification) => {
    const d = (n.data || {}) as Record<string, string | undefined>;
    const kind = d.kind || n.type || '';

    if (kind === 'message' && d.peerUserId && d.peerName) {
      navigation.navigate('ChatThread', {
        peerUserId: d.peerUserId,
        peerName: d.peerName,
        peerAvatar: d.peerAvatar || '',
      });
      return;
    }
    if (kind === 'friend_request' || kind === 'friend_accepted') {
      goTab('Friends', 'FriendsMain');
      return;
    }
    if (kind === 'event_reminder') {
      goTab('Events', 'EventsMain');
      return;
    }
    if (kind === 'contribution_received') {
      goTab('Home', 'ContributionProgress');
      return;
    }
    if (kind === 'public_wishlist' || kind === 'friends_wishlist' || kind === 'wishlist_update') {
      goTab('Events', 'EventsMain');
      return;
    }
    if (kind === 'password_changed' || kind === 'profile_updated') {
      goTab('Profile', 'ProfileMain');
      return;
    }
    // Default
    goTab('Home', 'HomeMain');
  };

  const handleNotificationPress = async (notification: Notification) => {
    try {
      await markNotificationReadApi(notification.id);
      setNotifications((prev) =>
        prev.map((item) => (item.id === notification.id ? { ...item, isUnread: false } : item))
      );
      refreshBadge();
    } catch {
      // No-op to keep UX simple.
    }

    const full = byId.get(notification.id);
    if (full) {
      navigateFrom(full);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsReadApi();
      setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
      setRaw((prev) => prev.map((n) => ({ ...n, read: true })));
      refreshBadge();
    } catch {
      // ignore
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <NotificationItem
      notification={item}
      onPress={handleNotificationPress}
    />
  );

  return (
    <View style={[styles.container]}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.markAllBtn} onPress={handleMarkAllRead} activeOpacity={0.7}>
          <Text style={styles.markAllText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>
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

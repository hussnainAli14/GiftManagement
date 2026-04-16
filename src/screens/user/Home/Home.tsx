import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { EventCard } from '../../../components';
import type { Event } from '../../../components/EventCard';
import { getMyEventsApi, type EventModel } from '../../../api/eventApi';
import { useAuth } from '../../../context/AuthContext';
import { useNotificationBadge } from '../../../context/NotificationBadgeContext';
import { colors } from '../../../theme';
import type { ChatThreadParams } from '../../../navigation/messagingParams';
import { styles } from './styles';

type HomeStackParamList = {
  HomeMain: undefined;
  Notifications: undefined;
  MessagesInbox: undefined;
  ChatThread: ChatThreadParams;
  PersonsWishlist: { eventTitle?: string; eventId?: string };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>;

function toCardEvent(event: EventModel): Event {
  return {
    id: event._id,
    name: event.name,
    dateTime: new Date(event.date).toLocaleString(),
  };
}

const Home = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const { unreadCount } = useNotificationBadge();

  const handleEventPress = (event: Event) => {
    navigation.navigate('PersonsWishlist', { eventTitle: event.name, eventId: event.id });
  };

  useEffect(() => {
    if (!user?.id) {
      setMyEvents([]);
      setEventsLoading(false);
      return;
    }
    let cancelled = false;
    setEventsLoading(true);
    const load = async () => {
      try {
        const events = await getMyEventsApi();
        if (!cancelled) setMyEvents(events.map(toCardEvent));
      } catch {
        if (!cancelled) setMyEvents([]);
      } finally {
        if (!cancelled) setEventsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const upcomingEventsFromFriends = useMemo<Event[]>(() => [], []);

  const handleNotificationsPress = () => {
    navigation.navigate('Notifications');
  };

  const handleMessagesPress = () => {
    navigation.navigate('MessagesInbox');
  };

  const handleSettingsPress = () => {
    navigation.getParent()?.navigate('Profile');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="card-giftcard" size={28} color={colors.primary} />
          <Text style={styles.greeting}>Hello, {user?.name ?? 'Friend'}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} onPress={handleSettingsPress}>
            <Icon name="settings" size={24} color={colors.notificationGray} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleMessagesPress}>
            <Icon name="chat" size={24} color={colors.notificationGray} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleNotificationsPress}>
            <View style={styles.iconWrap}>
              <Icon name="notifications" size={24} color={colors.notificationGray} />
              {unreadCount > 0 ? (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>
                    {unreadCount > 9 ? '9+' : String(unreadCount)}
                  </Text>
                </View>
              ) : null}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Upcoming Events From Friends Section */}
        {upcomingEventsFromFriends.length > 0 && (
          <>
            <Text style={styles.firstSectionTitle}>Upcoming Events From Friends</Text>
            {upcomingEventsFromFriends.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={handleEventPress}
              />
            ))}
          </>
        )}

        {/* My Events — heading always; list or empty message */}
        <Text
          style={
            upcomingEventsFromFriends.length > 0 ? styles.sectionTitle : styles.firstSectionTitle
          }
        >
          My Events
        </Text>
        {eventsLoading ? (
          <ActivityIndicator style={styles.eventsLoading} color={colors.primary} />
        ) : myEvents.length > 0 ? (
          myEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={handleEventPress}
            />
          ))
        ) : (
          <Text style={styles.emptyEventsMessage}>
            You don't have any events yet. Open the Events tab to create one.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Home;

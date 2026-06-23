import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { EventCard } from '../../../components';
import type { Event } from '../../../components/EventCard';
import { getMyEventsApi, type EventModel } from '../../../api/eventApi';
import { useAuth } from '../../../context/AuthContext';
import { useNotificationBadge } from '../../../context/NotificationBadgeContext';
import { colors } from '../../../theme';
import type { ChatThreadParams } from '../../../navigation/messagingParams';
import { sortEventsByUpcoming } from '../../../utils/sortEventsByUpcoming';
import { showOwnEventActions } from '../../../utils/ownEventActions';
import { styles } from './styles';

type HomeStackParamList = {
  HomeMain: undefined;
  Notifications: undefined;
  MessagesInbox: undefined;
  ChatThread: ChatThreadParams;
  PersonsWishlist: { eventTitle?: string; eventId?: string };
  EditEvent: { eventId: string };
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
    showOwnEventActions({
      eventName: event.name,
      eventId: event.id,
      onViewWishlist: () => {
        navigation.navigate('PersonsWishlist', { eventTitle: event.name, eventId: event.id });
      },
      onEdit: () => {
        navigation.navigate('EditEvent', { eventId: event.id });
      },
      onDeleted: () => {
        setMyEvents((prev) => prev.filter((item) => item.id !== event.id));
        Alert.alert('Event deleted', `"${event.name}" was removed.`);
      },
    });
  };

  const loadEvents = useCallback(async () => {
    if (!user?.id) {
      setMyEvents([]);
      setEventsLoading(false);
      return;
    }
    setEventsLoading(true);
    try {
      const mine = await getMyEventsApi();
      setMyEvents(sortEventsByUpcoming(mine).map(toCardEvent));
    } catch {
      setMyEvents([]);
    } finally {
      setEventsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [loadEvents])
  );

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
        <Text style={styles.firstSectionTitle}>Upcoming Events</Text>
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
            You have not created any events yet. Open the Events tab and tap + to create one.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Home;

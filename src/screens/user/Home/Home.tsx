import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { EventCard } from '../../../components';
import type { Event } from '../../../components/EventCard';
import { getMyEventsApi, type EventModel } from '../../../api/eventApi';
import {
  getUpcomingOccasionsApi,
  type UpcomingOccasion,
} from '../../../api/occasionApi';
import { useAuth } from '../../../context/AuthContext';
import { useNotificationBadge } from '../../../context/NotificationBadgeContext';
import { colors } from '../../../theme';
import type { ChatThreadParams } from '../../../navigation/messagingParams';
import { sortEventsByUpcoming } from '../../../utils/sortEventsByUpcoming';
import { isEventUpcoming } from '../../../utils/eventDate';
import { showOwnEventActions } from '../../../utils/ownEventActions';
import { styles } from './styles';

type HomeStackParamList = {
  HomeMain: undefined;
  Notifications: undefined;
  MessagesInbox: undefined;
  ChatThread: ChatThreadParams;
  PersonsWishlist: { eventTitle?: string; eventId?: string; userId?: string };
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

function occasionIcon(type: string): string {
  const t = type.toLowerCase();
  if (t.includes('birthday')) return 'cake';
  if (t.includes('anniversary') || t.includes('wedding')) return 'favorite';
  if (t.includes('graduation')) return 'school';
  return 'event';
}

function daysUntilLabel(days: number): string {
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `In ${days} days`;
}

const Home = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [occasions, setOccasions] = useState<UpcomingOccasion[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [occasionsLoading, setOccasionsLoading] = useState(true);
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
      const upcoming = mine.filter((event) => isEventUpcoming(event.date));
      setMyEvents(sortEventsByUpcoming(upcoming).map(toCardEvent));
    } catch {
      setMyEvents([]);
    } finally {
      setEventsLoading(false);
    }
  }, [user?.id]);

  const loadOccasions = useCallback(async () => {
    if (!user?.id) {
      setOccasions([]);
      setOccasionsLoading(false);
      return;
    }
    setOccasionsLoading(true);
    try {
      const list = await getUpcomingOccasionsApi(30);
      setOccasions(list);
    } catch {
      setOccasions([]);
    } finally {
      setOccasionsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadEvents();
    loadOccasions();
  }, [loadEvents, loadOccasions]);

  useFocusEffect(
    useCallback(() => {
      loadEvents();
      loadOccasions();
    }, [loadEvents, loadOccasions])
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

  const handleFavoriteProducts = () => {
    if (!user?.id) return;
    navigation.navigate('PersonsWishlist', {
      userId: user.id,
      eventTitle: 'Favorite Products',
    });
  };

  const handleOccasionPress = (occasion: UpcomingOccasion) => {
    if (occasion.kind === 'friend_birthday' && occasion.friendId) {
      navigation.getParent()?.navigate('Friends' as never, {
        screen: 'FriendProfile',
        params: {
          friendId: occasion.friendId,
          friendName: occasion.friendName || 'Friend',
        },
      } as never);
      return;
    }
    if (occasion.eventId && occasion.isOwn) {
      handleEventPress({
        id: occasion.eventId,
        name: occasion.title,
        dateTime: new Date(occasion.date).toLocaleString(),
      });
      return;
    }
    navigation.getParent()?.navigate('Events' as never, {
      screen: 'EventsMain',
    } as never);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.favoritesButton}
          activeOpacity={0.85}
          onPress={handleFavoriteProducts}
        >
          <View style={styles.favoritesIconWrap}>
            <Icon name="favorite" size={22} color={colors.primary} />
          </View>
          <View style={styles.favoritesContent}>
            <Text style={styles.favoritesTitle}>Favorite Products</Text>
            <Text style={styles.favoritesSubtitle}>
              Save products from your city vendors for friends to gift you
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color={colors.darkGray} />
        </TouchableOpacity>

        <Text style={styles.firstSectionTitle}>Upcoming Occasions</Text>
        {occasionsLoading ? (
          <ActivityIndicator style={styles.eventsLoading} color={colors.primary} />
        ) : occasions.length > 0 ? (
          occasions.slice(0, 8).map((occasion) => (
            <TouchableOpacity
              key={occasion.id}
              style={styles.occasionCard}
              activeOpacity={0.85}
              onPress={() => handleOccasionPress(occasion)}
            >
              <View style={styles.occasionIconWrap}>
                <Icon
                  name={occasionIcon(occasion.type)}
                  size={22}
                  color={colors.primary}
                />
              </View>
              <View style={styles.occasionContent}>
                <Text style={styles.occasionTitle} numberOfLines={1}>
                  {occasion.title}
                </Text>
                <Text style={styles.occasionMeta}>
                  {occasion.type} ·{' '}
                  {new Date(occasion.date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>
              <View style={styles.occasionBadge}>
                <Text style={styles.occasionBadgeText}>
                  {daysUntilLabel(occasion.daysUntil)}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyEventsMessage}>
            No upcoming birthdays or anniversaries in the next 30 days. Add friends with birthdays
            or create occasion events to get reminders.
          </Text>
        )}

        <Text style={styles.sectionTitle}>Upcoming Events</Text>
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
            You have no upcoming events. Open the Events tab to create one or view past events.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Home;

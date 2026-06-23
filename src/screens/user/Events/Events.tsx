import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EventListItem } from '../../../components';
import type { EventListItemData, EventStatus } from '../../../components/EventListItem';
import { getEventsFeedApi, type EventModel } from '../../../api/eventApi';
import { useAuth } from '../../../context/AuthContext';
import { isEventPast } from '../../../utils/eventDate';
import { getEventCreatorId } from '../../../utils/getEventCreatorId';
import { showOwnEventActions } from '../../../utils/ownEventActions';
import { styles } from './styles';

type EventsStackParamList = {
  EventsMain: undefined;
  PersonsWishlist: { eventTitle?: string; eventId?: string };
  EditEvent: { eventId: string };
};

type EventsScreenNavigationProp = NativeStackNavigationProp<EventsStackParamList, 'EventsMain'>;

function toListItem(event: EventModel, viewerId?: string): EventListItemData {
  const eventDate = new Date(event.date);
  const past = isEventPast(event.date);
  const status: EventStatus =
    eventDate.toString() === 'Invalid Date' ? 'draft' : past ? 'past' : 'upcoming';
  const creatorId = getEventCreatorId(event);
  return {
    id: event._id,
    title: event.name,
    date: status === 'draft' ? 'TBD' : eventDate.toLocaleDateString(),
    status,
    isOwnEvent: !!viewerId && !!creatorId && creatorId === viewerId,
  };
}

type FilterTab = EventStatus;

const Events = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterTab>('upcoming');
  const [allEvents, setAllEvents] = useState<EventListItemData[]>([]);
  const navigation = useNavigation<EventsScreenNavigationProp>();
  const { user } = useAuth();

  const loadEvents = useCallback(async () => {
    try {
      const events = await getEventsFeedApi();
      setAllEvents(events.map((event) => toListItem(event, user?.id)));
    } catch {
      setAllEvents([]);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [loadEvents]),
  );

  const counts = useMemo(() => {
    return {
      upcoming: allEvents.filter((e) => e.status === 'upcoming').length,
      past: allEvents.filter((e) => e.status === 'past').length,
      draft: allEvents.filter((e) => e.status === 'draft').length,
    };
  }, [allEvents]);

  const filteredEvents = useMemo(
    () => allEvents.filter((e) => e.status === selectedFilter),
    [allEvents, selectedFilter]
  );

  const handleEventPress = (event: EventListItemData) => {
    if (event.isOwnEvent) {
      showOwnEventActions({
        eventName: event.title,
        eventId: event.id,
        onViewWishlist: () => {
          navigation.navigate('PersonsWishlist', { eventTitle: event.title, eventId: event.id });
        },
        onEdit: () => {
          navigation.navigate('EditEvent', { eventId: event.id });
        },
        onDeleted: () => {
          setAllEvents((prev) => prev.filter((item) => item.id !== event.id));
          Alert.alert('Event deleted', `"${event.title}" was removed.`);
        },
      });
      return;
    }

    navigation.navigate('PersonsWishlist', { eventTitle: event.title, eventId: event.id });
  };

  const renderFilterTag = (filter: FilterTab, label: string, count: number) => {
    const isSelected = selectedFilter === filter;
    return (
      <TouchableOpacity
        key={filter}
        style={[styles.filterTag, isSelected && styles.filterTagSelected]}
        onPress={() => setSelectedFilter(filter)}
      >
        <Text
          style={[
            styles.filterTagText,
            isSelected && styles.filterTagTextSelected,
          ]}
        >
          {label} {count}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEvent = ({ item }: { item: EventListItemData }) => (
    <EventListItem event={item} onPress={handleEventPress} />
  );

  return (
    <View style={styles.container}>
      {/* Filter tags */}
      <View style={styles.filterRow}>
        {renderFilterTag('upcoming', 'Upcoming', counts.upcoming)}
        {renderFilterTag('past', 'Past', counts.past)}
        {renderFilterTag('draft', 'Drafts', counts.draft)}
      </View>

      {/* Event list */}
      <FlatList
        data={filteredEvents}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Events;

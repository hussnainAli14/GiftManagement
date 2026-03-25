import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EventListItem } from '../../../components';
import type { EventListItemData, EventStatus } from '../../../components/EventListItem';
import { styles } from './styles';

type EventsStackParamList = {
  EventsMain: undefined;
  PersonsWishlist: { eventTitle?: string };
};

type EventsScreenNavigationProp = NativeStackNavigationProp<EventsStackParamList, 'EventsMain'>;

// Mock data - replace with real API data when integrating
const allEvents: EventListItemData[] = [
  {
    id: '1',
    title: "Sarah's 30th Birthday",
    date: 'Dec 25, 2026',
    status: 'upcoming',
  },
  {
    id: '2',
    title: "Mom & Dad's 25th Anniversary",
    date: 'Dec 31, 2026',
    status: 'upcoming',
  },
  {
    id: '3',
    title: "Grandma's 80th Birthday Celebration",
    date: 'Nov 28, 2026',
    status: 'upcoming',
  },
  {
    id: '4',
    title: "Hamza & Nadia's Anniversary Dinner",
    date: 'Jan 15, 2027',
    status: 'upcoming',
  },
  {
    id: '5',
    title: 'Company Holiday Party',
    date: 'Oct 10, 2025',
    status: 'past',
  },
  {
    id: '6',
    title: 'Team Building Event',
    date: 'Sep 5, 2025',
    status: 'past',
  },
  {
    id: '7',
    title: 'Summer BBQ',
    date: 'Aug 20, 2025',
    status: 'past',
  },
  {
    id: '8',
    title: 'Birthday Planning',
    date: 'TBD',
    status: 'draft',
  },
  {
    id: '9',
    title: 'Anniversary Ideas',
    date: 'TBD',
    status: 'draft',
  },
];

type FilterTab = EventStatus;

const Events = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterTab>('upcoming');
  const navigation = useNavigation<EventsScreenNavigationProp>();

  const counts = useMemo(() => {
    return {
      upcoming: allEvents.filter((e) => e.status === 'upcoming').length,
      past: allEvents.filter((e) => e.status === 'past').length,
      draft: allEvents.filter((e) => e.status === 'draft').length,
    };
  }, []);

  const filteredEvents = useMemo(
    () => allEvents.filter((e) => e.status === selectedFilter),
    [selectedFilter]
  );

  const handleEventPress = (event: EventListItemData) => {
    navigation.navigate('PersonsWishlist', { eventTitle: event.title });
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

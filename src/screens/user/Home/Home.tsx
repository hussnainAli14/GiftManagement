import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { EventCard } from '../../../components';
import type { Event } from '../../../components/EventCard';
import { colors } from '../../../theme';
import { styles } from './styles';

type HomeStackParamList = {
  HomeMain: undefined;
  Notifications: undefined;
  PersonsWishlist: { eventTitle?: string };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>;

// Mock data - replace with real API data when integrating
const upcomingEventsFromFriends: Event[] = [
  {
    id: '1',
    name: "Ali's 30th Birthday",
    dateTime: 'Dec 15, 2023 at 7:00 PM',
  },
];

const myEvents: Event[] = [
  {
    id: '2',
    name: 'My Birthday',
    dateTime: 'Jan 10, 2024 at 8:00 PM',
  },
  {
    id: '3',
    name: 'Hussein 2nd Anniversary',
    dateTime: 'Dec 25, 2023 at 2:00 PM',
  },
];

const Home = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleEventPress = (event: Event) => {
    navigation.navigate('PersonsWishlist', { eventTitle: event.name });
  };

  const handleNotificationsPress = () => {
    navigation.navigate('Notifications');
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
          <Text style={styles.greeting}>Hello, Ali</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} onPress={handleSettingsPress}>
            <Icon name="settings" size={24} color={colors.notificationGray} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleNotificationsPress}>
            <Icon name="notifications" size={24} color={colors.notificationGray} />
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

        {/* My Events Section */}
        {myEvents.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>My Events</Text>
            {myEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={handleEventPress}
              />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default Home;

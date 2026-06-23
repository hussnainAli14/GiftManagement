import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { View, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Dropdown, TextInput, DatePicker, Button } from '../../../components';
import type { DropdownOption } from '../../../components';
import { createEventApi, getEventByIdApi, updateEventApi } from '../../../api/eventApi';
import { colors } from '../../../theme';
import { styles } from './styles';

type CreateEventStackParamList = {
  CreateEventStep1: { eventId?: string } | undefined;
  CreateEventStep2: { eventId: string; eventTitle: string };
  EditEvent: { eventId: string };
};

type CreateEventStep1NavigationProp = NativeStackNavigationProp<CreateEventStackParamList>;

// Dummy options - replace with actual options later
const EVENT_TYPE_OPTIONS: DropdownOption[] = [
  { label: 'Birthday', value: 'Birthday' },
  { label: 'Anniversary', value: 'Anniversary' },
  { label: 'Wedding', value: 'Wedding' },
  { label: 'Baby Shower', value: 'Other' },
  { label: 'Other', value: 'Other' },
];

const PRIVACY_OPTIONS: DropdownOption[] = [
  { label: 'Friends Only (Visible to your friends)', value: 'friends' },
  { label: 'Public (Visible to everyone)', value: 'public' },
  { label: 'Private (Only you can see)', value: 'private' },
];

const CreateEventStep1 = () => {
  const navigation = useNavigation<CreateEventStep1NavigationProp>();
  const route = useRoute();
  const eventId = (route.params as { eventId?: string } | undefined)?.eventId;
  const isEditing = !!eventId;

  const [eventType, setEventType] = useState<string | number | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [privacy, setPrivacy] = useState<string | number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);

  useEffect(() => {
    if (!eventId) return;

    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const event = await getEventByIdApi(eventId);
        if (cancelled) return;
        setEventTitle(event.name);
        const parsedDate = new Date(event.date);
        setEventDate(Number.isNaN(parsedDate.getTime()) ? null : parsedDate);
        setEventType(event.type ?? null);
        setPrivacy(event.privacy ?? null);
      } catch (error) {
        if (!cancelled) {
          Alert.alert(
            'Could not load event',
            error instanceof Error ? error.message : 'Please try again.',
          );
          navigation.goBack();
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [eventId, navigation]);

  const handleNext = async () => {
    if (!eventTitle.trim() || !eventDate) {
      Alert.alert('Missing Fields', 'Please add event title and date.');
      return;
    }
    if (!eventType) {
      Alert.alert('Missing Event Type', 'Please select an event type.');
      return;
    }
    try {
      setIsSubmitting(true);
      const payload = {
        name: eventTitle.trim(),
        date: eventDate.toISOString(),
        type: String(eventType),
        privacy: privacy ? String(privacy) : undefined,
      };

      if (isEditing && eventId) {
        await updateEventApi(eventId, payload);
        navigation.goBack();
        return;
      }

      const created = await createEventApi(payload);
      navigation.navigate('CreateEventStep2', { eventId: created._id, eventTitle: created.name });
    } catch (error) {
      Alert.alert(
        'Failed',
        error instanceof Error ? error.message : isEditing ? 'Unable to update event' : 'Unable to create event',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Dropdown
          label="Event Type"
          placeholder="Select event type"
          value={eventType}
          onChange={setEventType}
          data={EVENT_TYPE_OPTIONS}
          containerStyle={styles.field}
        />

        <TextInput
          label="Event Title"
          placeholder="e.g., Sarah's 30th Birthday Bash"
          value={eventTitle}
          onChangeText={setEventTitle}
          containerStyle={styles.field}
        />

        <DatePicker
          label="Event Date"
          placeholder="Select Date"
          value={eventDate}
          onChange={setEventDate}
          leftIcon={<Icon name="event" size={20} color={colors.darkGray} />}
          containerStyle={styles.field}
        />

        <Dropdown
          label="Privacy"
          placeholder="Select privacy"
          value={privacy}
          onChange={setPrivacy}
          data={PRIVACY_OPTIONS}
          containerStyle={styles.field}
        />

        <Button
          variant="primary"
          fullWidth
          onPress={handleNext}
          disabled={isSubmitting || isLoading}
          style={styles.nextButton}
        >
          {isSubmitting
            ? isEditing
              ? 'Saving...'
              : 'Creating...'
            : isEditing
              ? 'Save Changes'
              : 'Next'}
        </Button>
      </ScrollView>
    </View>
  );
};

export default CreateEventStep1;

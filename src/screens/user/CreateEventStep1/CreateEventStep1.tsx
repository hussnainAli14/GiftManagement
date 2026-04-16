import React, { useState } from 'react';
import { Alert } from 'react-native';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Dropdown, TextInput, DatePicker, Button } from '../../../components';
import type { DropdownOption } from '../../../components';
import { createEventApi } from '../../../api/eventApi';
import { colors } from '../../../theme';
import { styles } from './styles';

type CreateEventStackParamList = {
  CreateEventStep1: undefined;
  CreateEventStep2: { eventId: string; eventTitle: string };
};

type CreateEventStep1NavigationProp = NativeStackNavigationProp<
  CreateEventStackParamList,
  'CreateEventStep1'
>;

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
  const [eventType, setEventType] = useState<string | number | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [privacy, setPrivacy] = useState<string | number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const created = await createEventApi({
        name: eventTitle.trim(),
        date: eventDate.toISOString(),
        type: String(eventType),
        privacy: privacy ? String(privacy) : undefined,
      });
      navigation.navigate('CreateEventStep2', { eventId: created._id, eventTitle: created.name });
    } catch (error) {
      Alert.alert('Failed', error instanceof Error ? error.message : 'Unable to create event');
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
          disabled={isSubmitting}
          style={styles.nextButton}
        >
          {isSubmitting ? 'Creating...' : 'Next'}
        </Button>
      </ScrollView>
    </View>
  );
};

export default CreateEventStep1;

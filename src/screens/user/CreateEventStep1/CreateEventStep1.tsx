import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Dropdown, TextInput, DatePicker, Button } from '../../../components';
import type { DropdownOption } from '../../../components';
import { colors } from '../../../theme';
import { styles } from './styles';

type CreateEventStackParamList = {
  CreateEventStep1: undefined;
  CreateEventStep2: undefined;
};

type CreateEventStep1NavigationProp = NativeStackNavigationProp<
  CreateEventStackParamList,
  'CreateEventStep1'
>;

// Dummy options - replace with actual options later
const EVENT_TYPE_OPTIONS: DropdownOption[] = [
  { label: 'Birthday', value: 'birthday' },
  { label: 'Anniversary', value: 'anniversary' },
  { label: 'Wedding', value: 'wedding' },
  { label: 'Baby Shower', value: 'baby_shower' },
  { label: 'Other', value: 'other' },
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

  const handleNext = () => {
    navigation.navigate('CreateEventStep2');
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
          style={styles.nextButton}
        >
          Next
        </Button>
      </ScrollView>
    </View>
  );
};

export default CreateEventStep1;

import React, { useState, useLayoutEffect, useCallback, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, CommonActions, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TextInput, Dropdown, RadioButton } from '../../../components';
import type { DropdownOption } from '../../../components';
import { createWishlistApi } from '../../../api/wishlistApi';
import { getMyEventsApi, type EventModel } from '../../../api/eventApi';
import { styles } from './styles';

type CreateEventStackParamList = {
  CreateEventStep1: undefined;
  CreateEventStep2: { eventId: string; eventTitle: string };
  WishlistDetail: { wishlistName?: string; eventId?: string };
};

type CreateEventStep2NavigationProp = NativeStackNavigationProp<
  CreateEventStackParamList,
  'CreateEventStep2'
>;

type VisibilityValue = 'public' | 'private' | 'shared';

const VISIBILITY_OPTIONS = [
  { value: 'public' as VisibilityValue, label: 'Public' },
  {
    value: 'private' as VisibilityValue,
    label: 'Private',
    description: 'Only you can view and contribute to this wishlist.',
  },
  { value: 'shared' as VisibilityValue, label: 'Shared with Friends' },
];

const CreateEventStep2 = () => {
  const navigation = useNavigation<CreateEventStep2NavigationProp>();
  const route = useRoute<RouteProp<CreateEventStackParamList, 'CreateEventStep2'>>();
  const [wishlistName, setWishlistName] = useState('');
  const [associatedEvent, setAssociatedEvent] = useState<string | number | null>(null);
  const [visibility, setVisibility] = useState<VisibilityValue | null>('private');

  const [isSaving, setIsSaving] = useState(false);
  const [eventOptions, setEventOptions] = useState<DropdownOption[]>([]);
  const eventId = route.params?.eventId;

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const events = await getMyEventsApi();
        setEventOptions(
          (events as EventModel[]).map((e) => ({
            label: e.name,
            value: e._id,
          }))
        );
        // Default select the event created on step 1.
        setAssociatedEvent((prev) => prev ?? eventId ?? null);
      } catch {
        setEventOptions([]);
      }
    };

    loadEvents();
  }, [eventId]);

  const handleSave = useCallback(async () => {
    const eventIdToUse = (associatedEvent ? String(associatedEvent) : eventId) ?? null;
    if (!eventIdToUse) {
      Alert.alert('Missing event', 'Please create event first.');
      return;
    }
    try {
      setIsSaving(true);
      await createWishlistApi(eventIdToUse);
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'EventsMain' },
            {
              name: 'WishlistDetail',
              params: {
                wishlistName: wishlistName.trim() || route.params?.eventTitle || 'Wishlist',
                eventId: eventIdToUse,
              },
            },
          ],
        })
      );
    } catch (error) {
      Alert.alert('Failed', error instanceof Error ? error.message : 'Unable to create wishlist');
    } finally {
      setIsSaving(false);
    }
  }, [associatedEvent, eventId, navigation, route.params?.eventTitle, wishlistName]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSave}
          style={{ marginRight: 16 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="save" size={24} color="#000000" />
        </TouchableOpacity>
      ),
    });
  }, [handleSave, navigation]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          label="Wishlist Name"
          placeholder="e.g., My Dream Wedding Registry"
          value={wishlistName}
          onChangeText={setWishlistName}
          containerStyle={styles.field}
        />

        <Dropdown
          label="Associated Event"
          placeholder="Select an Event"
          value={associatedEvent}
          onChange={setAssociatedEvent}
          data={eventOptions}
          containerStyle={styles.field}
        />

        <View style={styles.visibilitySection}>
          <RadioButton<VisibilityValue>
            options={VISIBILITY_OPTIONS}
            value={visibility}
            onChange={setVisibility}
            containerStyle={styles.radioGroup}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateEventStep2;

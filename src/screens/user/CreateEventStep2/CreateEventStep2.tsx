import React, { useState, useLayoutEffect } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TextInput, Dropdown, RadioButton } from '../../../components';
import type { DropdownOption } from '../../../components';
import { styles } from './styles';

type CreateEventStackParamList = {
  CreateEventStep1: undefined;
  CreateEventStep2: undefined;
  WishlistDetail: { wishlistName?: string };
};

type CreateEventStep2NavigationProp = NativeStackNavigationProp<
  CreateEventStackParamList,
  'CreateEventStep2'
>;

type VisibilityValue = 'public' | 'private' | 'shared';

// Dummy events for Associated Event dropdown
const ASSOCIATED_EVENT_OPTIONS: DropdownOption[] = [
  { label: "Sarah's 30th Birthday", value: 'event_1' },
  { label: "Mom & Dad's 25th Anniversary", value: 'event_2' },
  { label: "Grandma's 80th Birthday", value: 'event_3' },
  { label: "Hamza & Nadia's Anniversary Dinner", value: 'event_4' },
  { label: 'Company Holiday Party', value: 'event_5' },
];

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
  const [wishlistName, setWishlistName] = useState('');
  const [associatedEvent, setAssociatedEvent] = useState<string | number | null>(null);
  const [visibility, setVisibility] = useState<VisibilityValue | null>('private');

  const handleSave = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'EventsMain' },
          {
            name: 'WishlistDetail',
            params: { wishlistName: wishlistName.trim() || 'Birthday Wishlist' },
          },
        ],
      })
    );
  };

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
  }, [navigation, wishlistName]);

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
          data={ASSOCIATED_EVENT_OPTIONS}
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

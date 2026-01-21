import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, DatePicker, Dropdown, Tag } from '../../../components';
import { colors } from '../../../theme';
import { typography } from '../../../theme';
import { styles } from './styles';
import type { PreferencesScreenNavigationProp, PreferencesFormData } from '../Welcome/types';

const INTEREST_TAGS = [
  'Outdoors',
  'Cooking',
  'Reading',
  'Tech',
  'Gaming',
  'Travel',
  'Fitness',
  'Art',
  'Music',
  'Photography',
  'Sports',
  'Volunteering',
];

const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Others', value: 'others' },
];

const Preferences = () => {
  const navigation = useNavigation<PreferencesScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PreferencesFormData>({
    mode: 'onChange',
    defaultValues: {
      birthdate: undefined,
      gender: null,
      interests: [],
    },
  });

  const birthdate = watch('birthdate');
  const gender = watch('gender');

  const handleInterestToggle = (tag: string) => {
    const newInterests = selectedInterests.includes(tag)
      ? selectedInterests.filter((t) => t !== tag)
      : [...selectedInterests, tag];
    
    setSelectedInterests(newInterests);
    setValue('interests', newInterests, { shouldValidate: true });
  };

  const onSubmit = (data: PreferencesFormData) => {
    console.log('Preferences data:', { ...data, interests: selectedInterests });
    // Navigate to Verify screen
    navigation.navigate('Verify');
  };

  // Button is disabled if birthdate or gender is not selected
  const isFormValid = birthdate && gender;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Birthdate */}
        <Controller
          control={control}
          name="birthdate"
          rules={{
            required: 'Birthdate is required',
          }}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              label="Birthdate"
              placeholder="Pick a date"
              value={value}
              onChange={onChange}
              leftIcon={<Icon name="calendar-today" size={20} color={colors.primaryMuted} />}
              error={errors.birthdate?.message}
              maximumDate={new Date()} // Can't select future dates
              containerStyle={styles.inputContainer}
            />
          )}
        />

        {/* Gender */}
        <Controller
          control={control}
          name="gender"
          rules={{
            required: 'Gender is required',
          }}
          render={({ field: { onChange, value } }) => (
            <Dropdown
              label="Gender"
              placeholder="Select your gender"
              value={value}
              onChange={onChange}
              data={GENDER_OPTIONS}
              error={errors.gender?.message}
              containerStyle={styles.inputContainer}
            />
          )}
        />

        {/* Interests */}
        <View style={styles.interestsContainer}>
          <Text style={styles.interestsLabel}>Interests</Text>
          <Text style={styles.interestsDescription}>
            Select a few topics that you enjoy to get personalized event suggestions.
          </Text>
          <View style={styles.tagsContainer}>
            {INTEREST_TAGS.map((tag, index) => {
              const isSelected = selectedInterests.includes(tag);
              return (
                <View
                  key={tag}
                  style={[
                    styles.tagWrapper,
                    index % 4 !== 3 && { marginRight: 8 },
                  ]}
                >
                  <Tag
                    backgroundColor={isSelected ? colors.primary : colors.lightGray}
                    textColor={isSelected ? colors.white : '#000000'}
                    pressable={true}
                    onPress={() => handleInterestToggle(tag)}
                  >
                    {tag}
                  </Tag>
                </View>
              );
            })}
          </View>
        </View>

        {/* Complete Signup Button */}
        <View style={styles.buttonContainer}>
          <Button
            variant="primary"
            fullWidth
            onPress={handleSubmit(onSubmit)}
            disabled={!isFormValid}
            style={styles.completeButton}
          >
            Complete Signup
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default Preferences;

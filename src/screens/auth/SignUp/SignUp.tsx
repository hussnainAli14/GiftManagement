import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm, Controller, useWatch } from 'react-hook-form';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, TextInput } from '../../../components';
import PakistanCityField from './PakistanCityField';
import { colors } from '../../../theme';
import { styles } from './styles';
import type { RouteProp } from '@react-navigation/native';
import { signupApi } from '../../../api/authApi';
import {
  getCoordinatesForCityId,
  getEnglishAddressForCityId,
  getPakistanCityById,
} from '../../../data/pakistanCities';
import type { AuthStackParamList, SignUpScreenNavigationProp, SignUpFormData } from '../Welcome/types';

const SignUp = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'SignUp'>>();
  const role = route.params?.role ?? 'user';
  const insets = useSafeAreaInsets();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<SignUpFormData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      city: '',
      password: '',
      confirmPassword: '',
    },
  });

  const watchedValues = useWatch({ control });
  const formValues = watchedValues ?? {
    fullName: '',
    email: '',
    phoneNumber: '',
    city: '',
    password: '',
    confirmPassword: '',
  };
  const password = formValues.password ?? '';

  useEffect(() => {
    if (formValues.confirmPassword) {
      void trigger('confirmPassword');
    }
  }, [password, formValues.confirmPassword, trigger]);

  const phoneDigits = (formValues.phoneNumber ?? '').replace(/\D/g, '');

  const isFormValid =
    (formValues.fullName ?? '').trim().length >= 2 &&
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test((formValues.email ?? '').trim()) &&
    phoneDigits.length >= 10 &&
    (formValues.city ?? '').trim().length > 0 &&
    password.length >= 6 &&
    (formValues.confirmPassword ?? '') === password;

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsSubmitting(true);

      const cityId = String(data.city || '');
      const city = getPakistanCityById(cityId);
      const location = getCoordinatesForCityId(cityId);
      if (!location || !city) {
        throw new Error('Please select your city.');
      }

      const result = await signupApi({
        role,
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        phoneNumber: data.phoneNumber.trim(),
        password: data.password,
        location,
        cityId,
        cityName: city.name,
        province: city.province,
        businessAddress: getEnglishAddressForCityId(cityId),
      });
      navigation.navigate('Verify', { email: result.email, role });
    } catch (error) {
      Alert.alert('Signup Failed', error instanceof Error ? error.message : 'Unable to signup');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Controller
          control={control}
          name="fullName"
          rules={{
            required: 'Full name is required',
            minLength: {
              value: 2,
              message: 'Full name must be at least 2 characters',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Full Name"
              placeholder="Enter your full name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              leftIcon={<Icon name="person" size={20} color={colors.primaryMuted} />}
              error={errors.fullName?.message}
              autoCapitalize="words"
              containerStyle={styles.inputContainer}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Email Address"
              placeholder="your.email@example.com"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              leftIcon={<Icon name="email" size={20} color={colors.primaryMuted} />}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={styles.inputContainer}
            />
          )}
        />

        <Controller
          control={control}
          name="phoneNumber"
          rules={{
            required: 'Phone number is required',
            validate: (value) =>
              value.replace(/\D/g, '').length >= 10 || 'Phone number must be at least 10 digits',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Phone Number"
              placeholder="0300 1234567"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              leftIcon={<Icon name="phone" size={20} color={colors.primaryMuted} />}
              error={errors.phoneNumber?.message}
              keyboardType="phone-pad"
              containerStyle={styles.inputContainer}
            />
          )}
        />

        <Controller
          control={control}
          name="city"
          rules={{
            required: 'City is required',
          }}
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <PakistanCityField
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={fieldState.isTouched ? errors.city?.message : undefined}
              containerStyle={styles.inputContainer}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Password"
              placeholder="Enter a strong password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              leftIcon={<Icon name="lock" size={20} color={colors.primaryMuted} />}
              rightIcon={
                <Icon
                  name={isPasswordVisible ? 'visibility-off' : 'visibility'}
                  size={20}
                  color={colors.primaryMuted}
                />
              }
              secureTextEntry={!isPasswordVisible}
              onRightIconPress={() => setIsPasswordVisible(!isPasswordVisible)}
              error={errors.password?.message}
              containerStyle={styles.inputContainer}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: 'Please confirm your password',
            validate: (value, values) =>
              value === values.password || 'Passwords do not match',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Confirm Password"
              placeholder="Confirm your password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              leftIcon={<Icon name="lock" size={20} color={colors.primaryMuted} />}
              rightIcon={
                <Icon
                  name={isConfirmPasswordVisible ? 'visibility-off' : 'visibility'}
                  size={20}
                  color={colors.primaryMuted}
                />
              }
              secureTextEntry={!isConfirmPasswordVisible}
              onRightIconPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
              error={errors.confirmPassword?.message}
              containerStyle={styles.inputContainer}
            />
          )}
        />

        <View style={styles.locationNotice}>
          <Icon name="location-city" size={20} color={colors.primary} />
          <Text style={styles.locationNoticeText}>
            {role === 'vendor'
              ? 'Select your business city so customers can find you in Pakistan.'
              : 'Select your city so friends can gift you from nearby vendors in Pakistan.'}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            variant="primary"
            fullWidth
            onPress={handleSubmit(onSubmit)}
            disabled={!isFormValid || isSubmitting}
            style={styles.continueButton}
          >
            {isSubmitting ? 'Creating Account...' : 'Continue'}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUp;

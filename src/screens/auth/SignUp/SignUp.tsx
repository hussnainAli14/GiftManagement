import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, TextInput } from '../../../components';
import { colors } from '../../../theme';
import { styles } from './styles';
import type { SignUpScreenNavigationProp, SignUpFormData } from '../Welcome/types';

const SignUp = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<SignUpFormData>({
    mode: 'onChange', // Enable real-time validation
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = (data: SignUpFormData) => {
    console.log('Sign Up data:', data);
    // Navigate to Preferences screen
    navigation.navigate('Preferences');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Full Name Input */}
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

        {/* Email Input */}
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

        {/* Phone Number Input */}
        <Controller
          control={control}
          name="phoneNumber"
          rules={{
            required: 'Phone number is required',
            pattern: {
              value: /^[\d\s\(\)\-]+$/,
              message: 'Invalid phone number',
            },
            minLength: {
              value: 10,
              message: 'Phone number must be at least 10 digits',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Phone Number"
              placeholder="(123) 456-7890"
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

        {/* Password Input */}
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

        {/* Confirm Password Input */}
        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: 'Please confirm your password',
            validate: (value) =>
              value === password || 'Passwords do not match',
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

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <Button
            variant="primary"
            fullWidth
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid}
            style={styles.continueButton}
          >
            Continue
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUp;

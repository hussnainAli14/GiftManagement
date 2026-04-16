import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, TextInput } from '../../../components';
import { colors } from '../../../theme';
import { styles } from './styles';
import { resetPasswordApi } from '../../../api/authApi';
import type { AuthStackParamList, ChangePasswordScreenNavigationProp, ChangePasswordFormData } from '../Welcome/types';

const ChangePassword = () => {
  const navigation = useNavigation<ChangePasswordScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'ChangePassword'>>();
  const insets = useSafeAreaInsets();
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ChangePasswordFormData>({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');

  const onSubmit = async (data: ChangePasswordFormData) => {
    // Check if passwords match
    if (data.newPassword !== data.confirmPassword) {
      return;
    }
    try {
      setIsSubmitting(true);
      if (!route.params?.email || !route.params?.otp) {
        throw new Error('Missing email or OTP context. Please retry forgot password flow.');
      }
      await resetPasswordApi(route.params.email, route.params.otp, data.newPassword);
      Alert.alert('Success', 'Password reset successful. Please login.');
      navigation.navigate('Login', { role: 'user' });
    } catch (error) {
      Alert.alert('Reset Failed', error instanceof Error ? error.message : 'Unable to reset password');
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
        {/* New Password Input */}
        <Controller
          control={control}
          name="newPassword"
          rules={{
            required: 'New password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="New Password"
              placeholder="Enter your new password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              leftIcon={<Icon name="lock" size={20} color={colors.primaryMuted} />}
              rightIcon={
                <Icon
                  name={isNewPasswordVisible ? 'visibility-off' : 'visibility'}
                  size={20}
                  color={colors.primaryMuted}
                />
              }
              secureTextEntry={!isNewPasswordVisible}
              onRightIconPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
              error={errors.newPassword?.message}
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
              value === newPassword || 'Passwords do not match',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Confirm Password"
              placeholder="Confirm your new password"
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

        {/* Reset Password Button */}
        <Button
          variant="primary"
          fullWidth
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          style={styles.resetButton}
        >
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </Button>
      </ScrollView>
    </View>
  );
};

export default ChangePassword;

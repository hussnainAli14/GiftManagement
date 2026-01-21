import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, TextInput } from '../../../components';
import { colors } from '../../../theme';
import { styles } from './styles';
import type { ForgotPasswordScreenNavigationProp, ForgotPasswordFormData } from '../Welcome/types';

const ForgotPassword = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    console.log('Forgot Password data:', data);
    // Navigate to OTP screen
    navigation.navigate('OTP');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <Text style={styles.title}>Reset Your Password</Text>

        {/* Description */}
        <Text style={styles.description}>
          Enter your email address and we'll send you a link to reset your password.
        </Text>

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

        {/* Send Reset Link Button */}
        <Button
          variant="primary"
          fullWidth
          onPress={handleSubmit(onSubmit)}
          style={styles.sendButton}
        >
          Send Reset Link
        </Button>
      </ScrollView>
    </View>
  );
};

export default ForgotPassword;

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MultiStepInput, Button } from '../../../components';
import { colors } from '../../../theme';
import { styles } from './styles';
import type { VerifyScreenNavigationProp, VerifyFormData } from '../Welcome/types';

const Verify = () => {
  const navigation = useNavigation<VerifyScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const [resendMessage, setResendMessage] = useState<string | undefined>();

  // Example email - in real app, this would come from navigation params or state
  const email = 'john.doe@example.com';

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VerifyFormData>({
    mode: 'onChange',
    defaultValues: {
      verificationCode: '',
    },
  });

  const handleCodeComplete = () => {
    // Code completion is handled automatically by react-hook-form validation
  };

  const onSubmit = (data: VerifyFormData) => {
    console.log('Verification data:', data);
    // Navigate to Success screen
    navigation.navigate('Success');
  };

  const handleResendCode = () => {
    // Reset form
    reset({
      verificationCode: '',
    });
    setResendMessage('A new code has been sent to your email');
    // Clear the message after 5 seconds
    setTimeout(() => {
      setResendMessage(undefined);
    }, 5000);
    // Handle resend logic here (e.g., API call)
    console.log('Resending code...');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Notification Banner */}
        <View style={styles.banner}>
          <Icon name="email" size={20} color={colors.white} />
          <Text style={styles.bannerText}>Verification code sent to your email!</Text>
        </View>

        {/* Email Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Icon name="email" size={64} color={colors.primary} />
          </View>
        </View>

        {/* Main Heading */}
        <Text style={styles.heading}>Check your email!</Text>

        {/* Description Text */}
        <Text style={styles.description}>
          We have sent a 6-digit verification code to <Text style={styles.emailText}>{email}</Text>. Please check your inbox and spam folder.
        </Text>
        <Text style={styles.subDescription}>
          Enter the code below to complete your account setup.
        </Text>

        {/* Verification Code Input */}
        <Controller
          control={control}
          name="verificationCode"
          rules={{
            required: 'Verification code is required',
            minLength: {
              value: 6,
              message: 'Please enter the complete 6-digit code',
            },
            pattern: {
              value: /^\d{6}$/,
              message: 'Code must be 6 digits',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <MultiStepInput
              label="Enter verification code"
              steps={6}
              value={value}
              onChangeText={onChange}
              error={errors.verificationCode?.message}
              autoFocus={true}
              keyboardType="number-pad"
              masked={true}
              containerStyle={styles.codeInputContainer}
              onComplete={handleCodeComplete}
            />
          )}
        />

        {/* Verify Button */}
        <Button
          variant="primary"
          fullWidth
          onPress={handleSubmit(onSubmit)}
          style={styles.verifyButton}
        >
          Verify
        </Button>

        {/* Resend Code Link */}
        <TouchableOpacity onPress={handleResendCode} style={styles.resendContainer}>
          <Text style={styles.resendText}>Resend Code</Text>
        </TouchableOpacity>

        {/* Resend Success Message */}
        {resendMessage && (
          <Text style={styles.resendMessage}>{resendMessage}</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Verify;

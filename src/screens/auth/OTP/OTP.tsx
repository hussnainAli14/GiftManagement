import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { MultiStepInput, Button } from '../../../components';
import { styles } from './styles';
import { forgotPasswordApi, verifyOtpApi } from '../../../api/authApi';
import type { AuthStackParamList, OTPScreenNavigationProp } from '../Welcome/types';

const OTP = () => {
  const navigation = useNavigation<OTPScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'OTP'>>();
  const insets = useSafeAreaInsets();
  const [otpValue, setOtpValue] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [resendMessage, setResendMessage] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const email = route.params?.email ?? '';

  const handleOTPComplete = (value: string) => {
    // Clear any errors when OTP is complete
    if (value.length === 6) {
      setError(undefined);
    }
  };

  const handleVerifyOTP = async () => {
    if (!email) {
      setError('Missing email. Please restart password reset.');
      return;
    }
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }
    try {
      setIsSubmitting(true);
      await verifyOtpApi(email, otpValue);
      navigation.navigate('ChangePassword', { email, otp: otpValue });
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Invalid OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError('Missing email. Please restart password reset.');
      return;
    }
    // Reset OTP value
    setOtpValue('');
    setError(undefined);
    try {
      await forgotPasswordApi(email);
      setResendMessage('A new otp has been sent to your email');
      setTimeout(() => {
        setResendMessage(undefined);
      }, 5000);
    } catch (apiError) {
      Alert.alert('Resend Failed', apiError instanceof Error ? apiError.message : 'Unable to resend OTP');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Instructional Text */}
        <Text style={styles.instructionText}>
          Please enter the 6-digit code sent to your email address to reset your password.
        </Text>

        {/* OTP Input */}
        <MultiStepInput
          steps={6}
          value={otpValue}
          onChangeText={(value) => {
            setOtpValue(value);
            setError(undefined);
          }}
          error={error}
          autoFocus={true}
          keyboardType="number-pad"
          masked={false}
          containerStyle={styles.otpContainer}
          onComplete={handleOTPComplete}
        />

        {/* Verify OTP Button */}
        <Button
          variant="primary"
          fullWidth
          onPress={handleVerifyOTP}
          disabled={isSubmitting}
          style={styles.verifyButton}
        >
          {isSubmitting ? 'Verifying...' : 'Verify OTP'}
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

export default OTP;

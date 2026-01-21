import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MultiStepInput, Button } from '../../../components';
import { styles } from './styles';
import type { OTPScreenNavigationProp } from '../Welcome/types';

const OTP = () => {
  const navigation = useNavigation<OTPScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const [otpValue, setOtpValue] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [resendMessage, setResendMessage] = useState<string | undefined>();

  const handleOTPComplete = (value: string) => {
    // Clear any errors when OTP is complete
    if (value.length === 6) {
      setError(undefined);
    }
  };

  const handleVerifyOTP = () => {
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }
    // Navigate to ChangePassword screen
    navigation.navigate('ChangePassword');
  };

  const handleResendCode = () => {
    // Reset OTP value
    setOtpValue('');
    setError(undefined);
    setResendMessage('A new otp has been sent to your email');
    // Clear the message after 5 seconds
    setTimeout(() => {
      setResendMessage(undefined);
    }, 5000);
    // Handle resend logic here
    console.log('Resending code...');
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
          style={styles.verifyButton}
        >
          Verify OTP
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

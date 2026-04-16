import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, TextInput } from '../../../components';
import { useAuth } from '../../../context/AuthContext';
import { loginApi } from '../../../api/authApi';
import { colors } from '../../../theme';
import { styles } from './styles';
import type { AuthStackParamList, LoginScreenNavigationProp, LoginFormData } from '../Welcome/types';

const Login = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'Login'>>();
  const { login } = useAuth();
  const role = route.params?.role ?? 'user';
  const insets = useSafeAreaInsets();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const email = watch('email');
  const password = watch('password');

  // Check if form is valid
  const isFormValid = 
    email.trim() !== '' &&
    password.trim() !== '' &&
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email) &&
    password.length >= 6;

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      const response = await loginApi({
        email: data.email.trim(),
        password: data.password,
        role,
      });

      await login({
        token: response.token,
        user: {
          id: response.id,
          name: response.name,
          email: response.email,
          role: response.role,
          isApproved: response.isApproved,
        },
      });
    } catch (error) {
      Alert.alert('Login Failed', error instanceof Error ? error.message : 'Unable to login');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword', { email });
  };

  const handleCreateAccount = () => {
    navigation.navigate('SignUp', { role });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* App Icon */}
        <View style={styles.iconContainer}>
          <Icon name="card-giftcard" size={60} color={colors.white} />
        </View>

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
              placeholder="Enter your email address"
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
              placeholder="Enter your password"
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

        {/* Login Button */}
        <Button
          variant="primary"
          fullWidth
          onPress={handleSubmit(onSubmit)}
          disabled={!isFormValid || isSubmitting}
          style={styles.loginButton}
        >
          {isSubmitting ? 'Logging In...' : 'Log In'}
        </Button>

        {/* Forgot Password Link */}
        <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* OR Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Create Account Button */}
        <Button
          variant="secondary"
          fullWidth
          onPress={handleCreateAccount}
          style={styles.createAccountButton}
        >
          Create Account
        </Button>
      </ScrollView>
    </View>
  );
};

export default Login;

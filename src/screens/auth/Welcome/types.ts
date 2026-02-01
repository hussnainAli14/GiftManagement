import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Welcome: undefined;
  RoleSelection: { mode: 'login' | 'signup' };
  Login: { role?: 'user' | 'vendor' };
  SignUp: { role?: 'user' | 'vendor' };
  ForgotPassword: undefined;
  OTP: undefined;
  Verify: undefined;
  ChangePassword: undefined;
  Success: undefined;
  Preferences: undefined;
};

export type WelcomeScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

export type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export type LoginFormData = {
  email: string;
  password: string;
};

export type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export type ForgotPasswordFormData = {
  email: string;
};

export type OTPScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'OTP'>;

export type ChangePasswordScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ChangePassword'>;

export type ChangePasswordFormData = {
  newPassword: string;
  confirmPassword: string;
};

export type SignUpScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

export type SignUpFormData = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
};

export type PreferencesScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Preferences'>;

export type PreferencesFormData = {
  birthdate?: Date;
  gender: string | null;
  interests: string[];
};

export type VerifyScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Verify'>;

export type VerifyFormData = {
  verificationCode: string;
};

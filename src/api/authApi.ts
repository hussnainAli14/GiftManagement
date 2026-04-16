import { apiRequest } from './http';

type Role = 'user' | 'vendor';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  isApproved?: boolean;
  token: string;
};

type AuthResponse = {
  success: boolean;
  message: string;
  data?: AuthUser | { email: string };
};

export async function loginApi(input: {
  email: string;
  password: string;
  role: Role;
}): Promise<AuthUser> {
  const endpoint = input.role === 'vendor' ? '/auth/vendor/login' : '/auth/user/login';
  const response = await apiRequest<AuthResponse>(endpoint, {
    method: 'POST',
    body: { email: input.email, password: input.password },
  });

  if (!response.success || !response.data || !('token' in response.data)) {
    throw new Error(response.message || 'Login failed');
  }

  return response.data;
}

export async function signupApi(input: {
  role: Role;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}): Promise<{ email: string }> {
  const endpoint = input.role === 'vendor' ? '/auth/vendor/signup' : '/auth/user/signup';
  const body =
    input.role === 'vendor'
      ? {
          name: input.fullName,
          email: input.email,
          phone: input.phoneNumber,
          password: input.password,
          category: 'General',
          businessName: input.fullName,
          businessAddress: 'Not provided',
          businessPhone: input.phoneNumber,
          description: 'New vendor',
        }
      : {
          name: input.fullName,
          email: input.email,
          phone: input.phoneNumber,
          password: input.password,
        };

  const response = await apiRequest<AuthResponse>(endpoint, {
    method: 'POST',
    body,
  });

  if (!response.success || !response.data || !('email' in response.data)) {
    throw new Error(response.message || 'Signup failed');
  }

  return { email: response.data.email };
}

export async function verifyEmailApi(email: string, code: string): Promise<void> {
  const response = await apiRequest<AuthResponse>('/auth/verify-email', {
    method: 'POST',
    body: { email, code },
  });
  if (!response.success) {
    throw new Error(response.message || 'Verification failed');
  }
}

export async function resendVerificationCodeApi(email: string): Promise<void> {
  const response = await apiRequest<AuthResponse>('/auth/resend-verification', {
    method: 'POST',
    body: { email },
  });
  if (!response.success) {
    throw new Error(response.message || 'Failed to resend verification code');
  }
}

export async function forgotPasswordApi(email: string): Promise<void> {
  const response = await apiRequest<AuthResponse>('/auth/forgot-password', {
    method: 'POST',
    body: { email },
  });
  if (!response.success) {
    throw new Error(response.message || 'Failed to send OTP');
  }
}

export async function verifyOtpApi(email: string, otp: string): Promise<void> {
  const response = await apiRequest<AuthResponse>('/auth/verify-otp', {
    method: 'POST',
    body: { email, otp },
  });
  if (!response.success) {
    throw new Error(response.message || 'OTP verification failed');
  }
}

export async function resetPasswordApi(email: string, otp: string, newPassword: string): Promise<void> {
  const response = await apiRequest<AuthResponse>('/auth/reset-password', {
    method: 'POST',
    body: { email, otp, newPassword },
  });
  if (!response.success) {
    throw new Error(response.message || 'Password reset failed');
  }
}

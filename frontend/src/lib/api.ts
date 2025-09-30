/**
 * API utility functions for direct backend communication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  error?: {
    code: number;
    details?: any;
  };
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Generic API request function
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new ApiError(
        data.message || 'Request failed',
        response.status,
        data.error?.details
      );
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error', 0, error);
  }
}

/**
 * Auth API functions
 */
export const authApi = {
  /**
   * User login
   */
  login: (credentials: { email: string; password: string }) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  /**
   * User registration
   */
  register: (userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  /**
   * Forgot password
   */
  forgotPassword: (email: string) =>
    apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  /**
   * Reset password
   */
  resetPassword: (token: string, newPassword: string) =>
    apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),

  /**
   * Verify email
   */
  verifyEmail: (token: string) =>
    apiRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  /**
   * Send OTP
   */
  sendOtp: (email: string) =>
    apiRequest('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  /**
   * Verify OTP
   */
  verifyOtp: (email: string, otpCode: string) =>
    apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otpCode }),
    }),

  /**
   * Get user profile
   */
  getProfile: (accessToken: string) =>
    apiRequest('/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }),
};

/**
 * Handle API errors with toast notifications
 */
export function handleApiError(error: unknown, toast: any) {
  if (error instanceof ApiError) {
    toast.error(error.message);
  } else {
    toast.error('Something went wrong. Please try again.');
  }
}

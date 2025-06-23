import axios from 'axios';
import Constants from 'expo-constants';

// Get API URL from environment variables
const API_URL = Constants.expoConfig?.extra?.apiUrl || 
               process.env.EXPO_PUBLIC_API_URL || 
               'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface AuthError {
  message: string;
  errors?: {
    email?: string;
    password?: string;
    name?: string;
  };
}

export interface VerifyResponse {
  valid: boolean;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const authAPI = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data as AuthError;
      }
      throw { message: 'Network error. Please try again.' } as AuthError;
    }
  },

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', { email, password, name });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data as AuthError;
      }
      throw { message: 'Network error. Please try again.' } as AuthError;
    }
  },

  async verifyToken(token: string): Promise<VerifyResponse> {
    try {
      const response = await api.get('/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { message: 'Token verification failed' };
    }
  },

  // Set authorization header for authenticated requests
  setAuthToken(token: string | null) {
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.Authorization;
    }
  },
};

// Export the configured axios instance for use in other API modules
export default api;

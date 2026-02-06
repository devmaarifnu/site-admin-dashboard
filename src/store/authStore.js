import { create } from 'zustand';
import { authApi } from '@/lib/api/auth';
import { setCookie, deleteCookie } from '@/lib/cookies';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  // Initialize auth from localStorage
  initialize: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const refreshToken = localStorage.getItem('refresh_token');
      const user = localStorage.getItem('user');

      if (token && user) {
        set({
          token,
          refreshToken,
          user: JSON.parse(user),
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    }
  },

  // Login
  login: async (credentials) => {
    try {
      const response = await authApi.login(credentials);
      const { user, access_token, refresh_token } = response.data;

      // Save to localStorage
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user', JSON.stringify(user));

      // Also save to cookies for middleware
      setCookie('auth_token', access_token, 7); // 7 days
      if (refresh_token) {
        setCookie('refresh_token', refresh_token, 30); // 30 days
      }

      set({
        user,
        token: access_token,
        refreshToken: refresh_token,
        isAuthenticated: true,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Continue logout even if API call fails
    } finally {
      // Clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');

      // Clear cookies
      deleteCookie('auth_token');
      deleteCookie('refresh_token');

      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
      });
    }
  },

  // Update user
  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  // Refresh user data
  refreshUser: async () => {
    try {
      const response = await authApi.me();
      const user = response.data;
      
      localStorage.setItem('user', JSON.stringify(user));
      set({ user });
      
      return user;
    } catch (error) {
      throw error;
    }
  },
}));

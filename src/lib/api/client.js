import axios from 'axios';
import { toast } from 'sonner';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            { refresh_token: refreshToken }
          );

          const { access_token } = response.data.data;
          localStorage.setItem('auth_token', access_token);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response) {
      const message = error.response.data?.error || error.response.data?.message || 'Terjadi kesalahan';
      
      // Show toast for specific errors
      if (error.response.status === 403) {
        toast.error('Anda tidak memiliki akses untuk melakukan aksi ini');
      } else if (error.response.status === 404) {
        toast.error('Data tidak ditemukan');
      } else if (error.response.status === 422) {
        // Validation errors
        const errors = error.response.data?.errors;
        if (errors) {
          Object.values(errors).forEach((err) => {
            toast.error(Array.isArray(err) ? err[0] : err);
          });
        }
      } else if (error.response.status >= 500) {
        toast.error('Terjadi kesalahan pada server');
      }
    } else if (error.request) {
      toast.error('Tidak dapat terhubung ke server');
    }

    return Promise.reject(error);
  }
);

export default apiClient;

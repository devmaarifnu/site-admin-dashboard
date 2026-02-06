import apiClient from './client';
import { API_ENDPOINTS } from '@/lib/constants';

export const usersApi = {
  // Get all users
  getAll: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.USERS, { params });
    return response.data;
  },

  // Get user by ID
  getById: async (id) => {
    const response = await apiClient.get(`${API_ENDPOINTS.USERS}/${id}`);
    return response.data;
  },

  // Create user
  create: async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.USERS, data);
    return response.data;
  },

  // Update user
  update: async (id, data) => {
    const response = await apiClient.put(`${API_ENDPOINTS.USERS}/${id}`, data);
    return response.data;
  },

  // Update user status
  updateStatus: async (id, status) => {
    const response = await apiClient.patch(`${API_ENDPOINTS.USERS}/${id}/status`, { status });
    return response.data;
  },

  // Delete user
  delete: async (id) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.USERS}/${id}`);
    return response.data;
  },
};

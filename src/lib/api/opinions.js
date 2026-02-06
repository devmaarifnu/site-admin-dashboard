import apiClient from './client';
import { API_ENDPOINTS } from '@/lib/constants';

export const opinionsApi = {
  // Get all opinions
  getAll: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.OPINIONS, { params });
    return response.data;
  },

  // Get opinion by ID
  getById: async (id) => {
    const response = await apiClient.get(`${API_ENDPOINTS.OPINIONS}/${id}`);
    return response.data;
  },

  // Create opinion
  create: async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.OPINIONS, data);
    return response.data;
  },

  // Update opinion
  update: async (id, data) => {
    const response = await apiClient.put(`${API_ENDPOINTS.OPINIONS}/${id}`, data);
    return response.data;
  },

  // Publish opinion
  publish: async (id) => {
    const response = await apiClient.patch(`${API_ENDPOINTS.OPINIONS}/${id}/publish`);
    return response.data;
  },

  // Delete opinion
  delete: async (id) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.OPINIONS}/${id}`);
    return response.data;
  },
};

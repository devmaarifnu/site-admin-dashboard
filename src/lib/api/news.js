import apiClient from './client';
import { API_ENDPOINTS } from '@/lib/constants';

export const newsApi = {
  // Get all news
  getAll: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.NEWS, { params });
    return response.data;
  },

  // Get news by ID
  getById: async (id) => {
    const response = await apiClient.get(`${API_ENDPOINTS.NEWS}/${id}`);
    return response.data;
  },

  // Create news
  create: async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.NEWS, data);
    return response.data;
  },

  // Update news
  update: async (id, data) => {
    const response = await apiClient.put(`${API_ENDPOINTS.NEWS}/${id}`, data);
    return response.data;
  },

  // Publish news
  publish: async (id) => {
    const response = await apiClient.patch(`${API_ENDPOINTS.NEWS}/${id}/publish`);
    return response.data;
  },

  // Archive news
  archive: async (id) => {
    const response = await apiClient.patch(`${API_ENDPOINTS.NEWS}/${id}/archive`);
    return response.data;
  },

  // Toggle featured
  toggleFeatured: async (id) => {
    const response = await apiClient.patch(`${API_ENDPOINTS.NEWS}/${id}/featured`);
    return response.data;
  },

  // Delete news
  delete: async (id) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.NEWS}/${id}`);
    return response.data;
  },
};

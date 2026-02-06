import apiClient from './client';
import { API_ENDPOINTS } from '@/lib/constants';

export const documentsApi = {
  // Get all documents
  getAll: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.DOCUMENTS, { params });
    return response.data;
  },

  // Get document by ID
  getById: async (id) => {
    const response = await apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/${id}`);
    return response.data;
  },

  // Create document
  create: async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.DOCUMENTS, data);
    return response.data;
  },

  // Update document
  update: async (id, data) => {
    const response = await apiClient.put(`${API_ENDPOINTS.DOCUMENTS}/${id}/file`, data);
    return response.data;
  },

  // Get document stats
  getStats: async (id) => {
    const response = await apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/${id}/stats`);
    return response.data;
  },

  // Delete document
  delete: async (id) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.DOCUMENTS}/${id}`);
    return response.data;
  },
};

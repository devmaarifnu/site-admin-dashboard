import apiClient from './client'

export const documentsApi = {
  getAll: (params) => apiClient.get('/documents', { params }),
  getById: (id) => apiClient.get(`/documents/${id}`),
  create: (data) => apiClient.post('/documents', data),
  update: (id, data) => apiClient.put(`/documents/${id}`, data),
  delete: (id) => apiClient.delete(`/documents/${id}`),
  bulkDelete: (ids) => apiClient.post('/documents/bulk-delete', { ids }),
  updateStatus: (id, status) => apiClient.patch(`/documents/${id}/status`, { status }),
}

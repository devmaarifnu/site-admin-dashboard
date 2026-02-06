import apiClient from './client'

export const heroSlidesApi = {
  getAll: (params) => apiClient.get('/hero-slides', { params }),
  getById: (id) => apiClient.get(`/hero-slides/${id}`),
  create: (data) => apiClient.post('/hero-slides', data),
  update: (id, data) => apiClient.put(`/hero-slides/${id}`, data),
  delete: (id) => apiClient.delete(`/hero-slides/${id}`),
  updateOrder: (slides) => apiClient.post('/hero-slides/reorder', { slides }),
}

export const eventFlyersApi = {
  getAll: (params) => apiClient.get('/event-flyers', { params }),
  getById: (id) => apiClient.get(`/event-flyers/${id}`),
  create: (data) => apiClient.post('/event-flyers', data),
  update: (id, data) => apiClient.put(`/event-flyers/${id}`, data),
  delete: (id) => apiClient.delete(`/event-flyers/${id}`),
  updateOrder: (flyers) => apiClient.post('/event-flyers/reorder', { flyers }),
}

export const organizationApi = {
  // Board Members
  getBoardMembers: (params) => apiClient.get('/organization/board-members', { params }),
  getBoardMemberById: (id) => apiClient.get(`/organization/board-members/${id}`),
  createBoardMember: (data) => apiClient.post('/organization/board-members', data),
  updateBoardMember: (id, data) => apiClient.put(`/organization/board-members/${id}`, data),
  deleteBoardMember: (id) => apiClient.delete(`/organization/board-members/${id}`),
  
  // Pengurus
  getPengurus: (params) => apiClient.get('/organization/pengurus', { params }),
  getPengurusById: (id) => apiClient.get(`/organization/pengurus/${id}`),
  createPengurus: (data) => apiClient.post('/organization/pengurus', data),
  updatePengurus: (id, data) => apiClient.put(`/organization/pengurus/${id}`, data),
  deletePengurus: (id) => apiClient.delete(`/organization/pengurus/${id}`),
  
  // Departments
  getDepartments: (params) => apiClient.get('/organization/departments', { params }),
  getDepartmentById: (id) => apiClient.get(`/organization/departments/${id}`),
  createDepartment: (data) => apiClient.post('/organization/departments', data),
  updateDepartment: (id, data) => apiClient.put(`/organization/departments/${id}`, data),
  deleteDepartment: (id) => apiClient.delete(`/organization/departments/${id}`),
}

export const pagesApi = {
  getVisiMisi: () => apiClient.get('/pages/visi-misi'),
  updateVisiMisi: (data) => apiClient.put('/pages/visi-misi', data),
  
  getSejarah: () => apiClient.get('/pages/sejarah'),
  updateSejarah: (data) => apiClient.put('/pages/sejarah', data),
  
  getProgramStrategis: () => apiClient.get('/pages/program-strategis'),
  updateProgramStrategis: (data) => apiClient.put('/pages/program-strategis', data),
}

export const contactMessagesApi = {
  getAll: (params) => apiClient.get('/contact-messages', { params }),
  getById: (id) => apiClient.get(`/contact-messages/${id}`),
  updateStatus: (id, status) => apiClient.patch(`/contact-messages/${id}/status`, { status }),
  delete: (id) => apiClient.delete(`/contact-messages/${id}`),
  bulkDelete: (ids) => apiClient.post('/contact-messages/bulk-delete', { ids }),
}

export const settingsApi = {
  getAll: () => apiClient.get('/settings'),
  update: (data) => apiClient.put('/settings', data),
  getByKey: (key) => apiClient.get(`/settings/${key}`),
  updateByKey: (key, data) => apiClient.put(`/settings/${key}`, data),
}

export const analyticsApi = {
  getOverview: () => apiClient.get('/analytics/overview'),
  getContentStats: (params) => apiClient.get('/analytics/content-stats', { params }),
  getTrafficStats: (params) => apiClient.get('/analytics/traffic', { params }),
  getPopularContent: (params) => apiClient.get('/analytics/popular-content', { params }),
}

export const activityLogsApi = {
  getAll: (params) => apiClient.get('/activity-logs', { params }),
  getById: (id) => apiClient.get(`/activity-logs/${id}`),
}

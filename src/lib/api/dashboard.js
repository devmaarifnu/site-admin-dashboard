import apiClient from './client';

export const dashboardApi = {
  getStats: () => apiClient.get('/dashboard/stats'),
  getRecentActivity: () => apiClient.get('/dashboard/recent-activity'),
  getPopularContent: () => apiClient.get('/dashboard/popular-content'),
};

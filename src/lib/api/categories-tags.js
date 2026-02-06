import apiClient from './client';

/**
 * Categories API
 * Handles category-related requests
 */
export const categoriesApi = {
  /**
   * Get all categories with optional filters
   * @param {Object} params - Query parameters (page, limit, search, type)
   * @returns {Promise} Response with categories list
   */
  getAll: async (params = {}) => {
    const response = await apiClient.get('/categories', { params });
    return response.data;
  },

  /**
   * Get single category by ID
   * @param {number} id - Category ID
   * @returns {Promise} Response with category data
   */
  getById: async (id) => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },

  /**
   * Create new category
   * @param {Object} data - Category data
   * @returns {Promise} Response with created category
   */
  create: async (data) => {
    const response = await apiClient.post('/categories', data);
    return response.data;
  },

  /**
   * Update category
   * @param {number} id - Category ID
   * @param {Object} data - Updated category data
   * @returns {Promise} Response with updated category
   */
  update: async (id, data) => {
    const response = await apiClient.put(`/categories/${id}`, data);
    return response.data;
  },

  /**
   * Delete category
   * @param {number} id - Category ID
   * @returns {Promise} Response
   */
  delete: async (id) => {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  },

  /**
   * Get categories by type
   * @param {string} type - Category type (news, opinion, document, etc.)
   * @returns {Promise} Response with categories list
   */
  getByType: async (type) => {
    const response = await apiClient.get(`/categories/type/${type}`);
    return response.data;
  },
};

/**
 * Tags API
 * Handles tag-related requests
 */
export const tagsApi = {
  /**
   * Get all tags with optional filters
   * @param {Object} params - Query parameters (page, limit, search, type)
   * @returns {Promise} Response with tags list
   */
  getAll: async (params = {}) => {
    const response = await apiClient.get('/tags', { params });
    return response.data;
  },

  /**
   * Get single tag by ID
   * @param {number} id - Tag ID
   * @returns {Promise} Response with tag data
   */
  getById: async (id) => {
    const response = await apiClient.get(`/tags/${id}`);
    return response.data;
  },

  /**
   * Create new tag
   * @param {Object} data - Tag data
   * @returns {Promise} Response with created tag
   */
  create: async (data) => {
    const response = await apiClient.post('/tags', data);
    return response.data;
  },

  /**
   * Update tag
   * @param {number} id - Tag ID
   * @param {Object} data - Updated tag data
   * @returns {Promise} Response with updated tag
   */
  update: async (id, data) => {
    const response = await apiClient.put(`/tags/${id}`, data);
    return response.data;
  },

  /**
   * Delete tag
   * @param {number} id - Tag ID
   * @returns {Promise} Response
   */
  delete: async (id) => {
    const response = await apiClient.delete(`/tags/${id}`);
    return response.data;
  },

  /**
   * Get tags by type
   * @param {string} type - Tag type (news, opinion, document, etc.)
   * @returns {Promise} Response with tags list
   */
  getByType: async (type) => {
    const response = await apiClient.get(`/tags/type/${type}`);
    return response.data;
  },

  /**
   * Get popular tags
   * @param {number} limit - Number of tags to return
   * @returns {Promise} Response with popular tags
   */
  getPopular: async (limit = 10) => {
    const response = await apiClient.get('/tags/popular', { params: { limit } });
    return response.data;
  },
};

// Combined API for convenience
export const categoriesTagsApi = {
  getCategories: categoriesApi.getAll,
  getCategoryById: categoriesApi.getById,
  createCategory: categoriesApi.create,
  updateCategory: categoriesApi.update,
  deleteCategory: categoriesApi.delete,
  
  getTags: tagsApi.getAll,
  getTagById: tagsApi.getById,
  createTag: tagsApi.create,
  updateTag: tagsApi.update,
  deleteTag: tagsApi.delete,
};

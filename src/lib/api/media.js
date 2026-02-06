export const mediaApi = {
  // Upload file to CDN via site-admin-api
  uploadToFileServer: async (file, tag = 'media', isPublic = true, onProgress) => {
    const apiClient = (await import('./client')).default;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tag', tag);
    formData.append('is_public', isPublic.toString());

    const response = await apiClient.post('/cdn/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });

    return response.data;
  },

  // Delete file from CDN
  deleteFromFileServer: async (fileUrl) => {
    const apiClient = (await import('./client')).default;
    const response = await apiClient.delete('/cdn/delete', {
      data: { file_url: fileUrl },
    });
    return response.data;
  },

  // Get all media from backend
  getAll: async (params = {}) => {
    const apiClient = (await import('./client')).default;
    const response = await apiClient.get('/media', { params });
    return response.data;
  },

  // Save media metadata to backend
  saveMetadata: async (data) => {
    const apiClient = (await import('./client')).default;
    const response = await apiClient.post('/media/upload', data);
    return response.data;
  },

  // Update media metadata
  updateMetadata: async (id, data) => {
    const apiClient = (await import('./client')).default;
    const response = await apiClient.put(`/media/${id}`, data);
    return response.data;
  },

  // Delete media (from both backend and file server)
  delete: async (id) => {
    const apiClient = (await import('./client')).default;
    const response = await apiClient.delete(`/media/${id}`);
    return response.data;
  },
};

// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// User Profile APIs
export const userService = {
  // Authentication
  login: (credentials) => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    return api.post('/user-profiles/login/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  },
  register: (userData) => {
    return api.post('/user-profiles/', userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  },

  // Profile Management
  getProfile: (userId) => api.get(`/user-profiles/${userId}/`),
  get: (userId) => api.get(`/user-profiles/${userId}/`),
  updateProfile: (userId, userData) => api.put(`/user-profiles/${userId}/`, userData),
  deleteProfile: (userId) => api.delete(`/user-profiles/${userId}/`),

  // User Statistics
  getUserCampaigns: (userId) => api.get(`/user-profiles/${userId}/campaigns/`),
  getUserInvestments: (userId) => api.get(`/user-profiles/${userId}/investments/`),
  getUserStatistics: (userId) => api.get(`/user-profiles/${userId}/statistics/`),
};

// Campaign APIs
export const campaignService = {
  // Basic CRUD
  create: (campaignData) => api.post('/campaigns/', campaignData),
  list: (params = {}) => api.get('/campaigns/', { params }),
  get: (campaignId) => api.get(`/campaigns/${campaignId}/`),
  update: (campaignId, campaignData) => api.put(`/campaigns/${campaignId}/`, campaignData),
  delete: (campaignId) => api.delete(`/campaigns/${campaignId}/`),

  // Campaign Specific
  getInvestments: (campaignId) => api.get(`/campaigns/${campaignId}/investments/`),
  getStatistics: (campaignId) => api.get(`/campaigns/${campaignId}/statistics/`),

  // Campaign Lists
  getActiveCampaigns: () => api.get('/campaigns/active/'),
  getTopCampaigns: (limit = 5) => api.get(`/campaigns/top/?limit=${limit}`),

  // Filtering
  getByCategory: (category) => api.get(`/campaigns/?category=${category}`),
  getByLocation: (location) => api.get(`/campaigns/?location=${location}`),
};

// Investment APIs
export const investmentService = {
  create: (investmentData) => api.post('/investments/', investmentData),
  list: () => api.get('/investments/'),
  get: (investmentId) => api.get(`/investments/${investmentId}/`),
  delete: (investmentId) => api.delete(`/investments/${investmentId}/`),
};

// Helper function to handle file uploads
export const uploadFile = async (file, type = 'profile_picture') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  return api.post('/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Transaction API functions
export const transactionAPI = {
  // Get transactions with filtering, sorting, and pagination
  getTransactions: async (params: Record<string, string> = {}) => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  // Get filter options (categories, statuses, users)
  getFilters: async () => {
    const response = await api.get('/transactions/filters');
    return response.data;
  },

  // Export transactions as CSV
  exportCSV: async (filters: any) => {
    const response = await api.post('/transactions/export', filters, {
      responseType: 'blob', 
    });
    return response.data;
  },

  // Get analytics data
  getAnalytics: async (params: Record<string, string> = {}) => {
    const response = await api.get('/transactions/analytics', { params });
    return response.data;
  },
};
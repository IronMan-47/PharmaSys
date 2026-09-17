import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
export const PYTHON_API_URL = import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor to catch 401 Unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      sessionStorage.removeItem('adminToken');
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const pythonApi = axios.create({
  baseURL: PYTHON_API_URL
});

export default api;

import axios from 'axios';

const API_BASE_URL = 'http://localhost:7070/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for injecting JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dayflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('dayflow_token');
      localStorage.removeItem('dayflow_user');
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';
import { STORAGE_KEYS } from '../constants/storage';

const api = axios.create({
  baseURL: '',
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';

// If we are in production (Render), use '/api'. If local, use localhost.
const baseURL = import.meta.env.PROD 
  ? '/api' 
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('spotibaiii_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
import { useAuthStore } from '@/stores/useAuthStore';
import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

http.interceptors.request.use((config) => {
  const token = useAuthStore()?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


export default http;
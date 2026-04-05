import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '', // Vite Proxy üzerinden otomatik http://localhost:8080/api... 'ye gidecek.
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    
    // Global Exception Handler parser
    if (data && data.message) {
      if (data.validationErrors && data.validationErrors.length > 0) {
        data.validationErrors.forEach((valErr: any) => {
           toast.error(`${valErr.field}: ${valErr.message}`);
        });
      } else {
        toast.error(data.message);
      }
    } else {
       toast.error("Beklenmeyen bir hata oluştu.");
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      useAuthStore.getState().logout();
      if (window.location.pathname !== '/login') {
         window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

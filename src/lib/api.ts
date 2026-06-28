import axios from 'axios';
import { toast } from 'react-hot-toast';

// Konfigurasi dasar
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// INTERCEPTOR REQUEST: Otomatis sisipkan JWT token ke setiap request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// INTERCEPTOR RESPONSE: Tangkap error global seperti 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;

        // Jangan redirect kalau lagi di halaman auth
        // Biar error login/register ditangani oleh halaman itu sendiri
        const isAuthPage = currentPath === '/login' || currentPath === '/register';

        if (!isAuthPage) {
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('user_session'); // hapus session juga
          toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        }
      }
    }
    // Lemparkan error ke block try-catch di komponen
    return Promise.reject(error);
  }
);

export default api;
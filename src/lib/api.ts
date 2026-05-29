import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Otomatis sisipkan JWT token ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;

      // Jangan redirect kalau lagi di halaman auth
      // Biar error login/register ditangani oleh halaman itu sendiri
      const isAuthPage = currentPath === '/login' || currentPath === '/register';

      if (!isAuthPage) {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_session'); // hapus session juga
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
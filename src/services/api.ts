import axios from 'axios';

// La URL base del backend se define mediante `VITE_API_BASE_URL` y se utiliza
// tanto en desarrollo como en producción.
const baseURL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

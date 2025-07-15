import axios from 'axios';

// Cuando se ejecuta en modo desarrollo usamos "/api" para que Vite redireccione
// las peticiones al backend definido en `VITE_API_BASE_URL` mediante su proxy.
// En producción se utiliza directamente la URL proporcionada por la variable.
const baseURL = import.meta.env.DEV
  ? '/api'
  : import.meta.env.VITE_API_BASE_URL || '';

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

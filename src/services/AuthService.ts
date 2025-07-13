import axios from './api';

const API_URL = '/api/auth';

class AuthService {
  async login(username: string, password: string) {
    // En un escenario real se haría una petición al backend usando axios
    // const response = await axios.post(`${API_URL}/login`, { username, password });
    // const token = response.data.token;

    // Como la API no está disponible, generamos un token simulado para permitir
    // el ingreso con cualquier contraseña
    const token = btoa(`${username}:${password}`); // token falso

    // Guardamos el token en localStorage para usarlo en las siguientes peticiones
    localStorage.setItem('token', token);
    return token;
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}

export default new AuthService();

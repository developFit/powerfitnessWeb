import axios from './api';

const API_URL = '/api/auth';

class AuthService {
  async login(username: string, password: string) {
    // En un escenario real se haría una petición al backend usando axios
    // const response = await axios.post(`${API_URL}/login`, { username, password });
    // const { token, role } = response.data;

    // Solo permitimos el ingreso del usuario administrador
    if (username !== 'admin') {
      throw new Error('Usuario no autorizado');
    }

    // Como la API no está disponible, generamos un token simulado para permitir
    // el ingreso con cualquier contraseña
    const token = btoa(`${username}:${password}`); // token falso

    // Guardamos el token y el rol en localStorage para usarlo en las siguientes peticiones
    localStorage.setItem('token', token);
    localStorage.setItem('role', 'admin');
    return token;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRole() {
    return localStorage.getItem('role');
  }
}

export default new AuthService();

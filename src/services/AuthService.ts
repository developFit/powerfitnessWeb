import axios from './api';

const API_URL = '/api/auth';

class AuthService {
  async login(username: string, password: string) {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    const token = response.data.token;
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

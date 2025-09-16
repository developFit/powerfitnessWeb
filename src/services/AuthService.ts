import { jwtDecode } from 'jwt-decode';
import axios from './api';

const API_URL = '/api/auth';

class AuthService {
  async login(username: string, password: string) {

    const response = await axios.post("/api/auth/login", {username, password})
    const claims: any = await jwtDecode(response.data.token);
    if(claims.authorities[0] == "ROLE_ALUMNO"){
      throw new Error('Usuario no autorizado');
    }

    sessionStorage.setItem('token', response.data.token);
    sessionStorage.setItem('role', claims.authorities[0]);
    sessionStorage.setItem('userId', response.data.usuario_id);
    return response.data.token;

  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
  }

  getToken() {
    return sessionStorage.getItem('token');
  }

  getRole() {
    return sessionStorage.getItem('role');
  }

  getUserId() {
    return sessionStorage.getItem('userId');
  }
}

export default new AuthService();

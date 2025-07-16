import axios from "./api";

const API_URL = "/api/ejercicios";

class EjerciciosService {
  getAll() {
    return axios.get(API_URL);
  }

  getById(id: number) {
    return axios.get(`${API_URL}/${id}`);
  }

  create(data: any) {
    return axios.post('/api/ejercicio', data);
  }

  update(id: number, data: any) {
    return axios.put(`${API_URL}/${id}`, data);
  }

  delete(id: number) {
    return axios.delete(`${API_URL}/${id}`);
  }
}

export default new EjerciciosService();

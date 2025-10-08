import axios from "./api";

const API_URL = "/api/alumnos";

class AlumnosService {
  getAll() {
    return axios.get(API_URL);
  }

  getById(id: number) {
    return axios.get(`${API_URL}/${id}`);
  }

  create(data: any) {
    return axios.post(API_URL, data);
  }

  update(id: number, data: any) {
    try {
      return axios.put(`/api/alumno/${id}`, data);
    } catch (error) {
      throw error;
    }
  }

  delete(id: number) {
    return axios.delete(`${API_URL}/${id}`);
  }
}

export default new AlumnosService();

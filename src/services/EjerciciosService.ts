import axios from "./api";

const API_URL = "/api/ejercicios";

class EjerciciosService {
  getAll() {
    return axios.get(API_URL);
  }
}

export default new EjerciciosService();

import axios from "./api";

const API_URL = "/api/getconfiguracionAlumnos";

class ConfiguracionAlumnosService {
  getAll() {
    return axios.get(API_URL);
  }
}

export default new ConfiguracionAlumnosService();

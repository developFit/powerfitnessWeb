import axios from "./api";

const API_URL = "/api/alumnos";

class AlumnosService {
  getAll() {
    return axios.get("/api/obtenerAlumnosConUsuario");
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

  async delete(idUsuario: number) {
    try {
      const response = await axios.delete(`/api/eliminarAlumno/${idUsuario}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new AlumnosService();

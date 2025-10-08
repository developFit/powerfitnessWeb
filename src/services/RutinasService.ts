import axios from "./api";

const API_URL = "/api/rutinas";

class RutinasService {
  async getAll() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  getById(id: number) {
    return axios.get(`${API_URL}/${id}`);
  }

  create(data: any) {
    return axios.post(API_URL, data);
  }

  update(id: number, data: any) {
    return axios.put(`/api/rutina/${id}`, data);
  }

  async delete(id: number) {
    try {
      const response = await axios.delete(`/api/rutina/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getByIdAlumno(idAlumno: number){
    try{
      const response = await axios.get("/api/rutina/" + idAlumno);
      return response.data;
    }
    catch (error){
      throw error;
    }
  }
}

export default new RutinasService();

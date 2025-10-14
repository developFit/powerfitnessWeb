import axios from "./api";

const API_URL = "/api/asistencias";

class AsistenciasService {
  async getAll(fechaABuscar: Date) {
    try{
      const response = await axios.get("/api/obtenerAsistenciasPorMes", {
        params: {
          fecha: fechaABuscar.toLocaleDateString('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
        }
      });
      return response.data;
    }
    catch(error){
      throw error;
    }
  }

  async getById(id: number, fechaABuscar: Date) {
    try{
      const response = await axios.get("/api/obtenerAsistenciasPorMesPorAlumno/" + id, {
        params: {
          fecha: fechaABuscar.toLocaleDateString('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
        }
      });
      return response.data;
    }
    catch(error){
      throw error;
    }
  }

  create(data: any) {
    return axios.post(API_URL, data);
  }

  update(id: number, data: any) {
    return axios.put(`${API_URL}/${id}`, data);
  }

  delete(id: number) {
    return axios.delete(`${API_URL}/${id}`);
  }
}

export default new AsistenciasService();

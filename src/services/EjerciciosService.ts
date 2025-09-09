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

  async createWithImage(data: any) {
    try {
      const formData = new FormData();
      const nuevo = {
        nombre: data.nombre,
        explicacion: data.explicacion,
        urlVideo: data.urlVideo,
        imagenUrl: undefined
      }
      formData.append("ejercicioRequestDTO", JSON.stringify(nuevo));
      formData.append("imagen", data.imagen)

      const response = await axios.post("/api/ejercicioConImagen", formData)
      return response.data
    } catch (error) {
      throw error;
    }
  }

  update(id: number, data: any) {
    return axios.put(`${API_URL}/${id}`, data);
  }

  delete(id: number) {
    return axios.delete(`${API_URL}/${id}`);
  }
}

export default new EjerciciosService();

import axios from "./api";

const API_URL = "/api/ejercicios";

class EjerciciosService {
  
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

  async update(idEjercicio: number, data: any, imagen: File | undefined) {
    try {
      const ejercicioParaForm = {
        nombre: data.nombre,
        explicacion: data.explicacion,
        urlVideo: data.urlVideo,
        imagenUrl: data.imagenUrl,
      }
      const formData = new FormData();
      formData.append("ejercicioRequestDTO", JSON.stringify(ejercicioParaForm));
      if(imagen){
        formData.append("imagen", imagen);
      }
      const response = await axios.put(`/api/ejercicio/${idEjercicio}`, formData);
      return response.data;
    } catch (error) {
      throw error
    }
  }

  async delete(id: number) {
    try {
      const response = await axios.delete(`/api/ejercicio/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new EjerciciosService();

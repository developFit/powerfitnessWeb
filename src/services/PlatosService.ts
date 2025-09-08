import axios from "./api";

const API_URL = "/api/platos";

class PlatosService {
  async getAll() {
    try {
      const response = await axios.get("/api/platosSugeridos");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  getById(id: number) {
    return axios.get(`${API_URL}/${id}`);
  }

  async create(data: any) {
    try {
      const formData = new FormData()
      formData.append("nombre", data.nombre);
      formData.append("descripcion", data.descripcion);
      formData.append("imagen", data.imagen);
      formData.append("calorias", data.calorias);
      formData.append("ingredientes", data.ingredientes);

      console.log(formData)
      const response = await axios.post("/api/platoSugerido",formData);
      return response.data;
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

export default new PlatosService();

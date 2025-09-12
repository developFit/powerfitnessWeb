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

  async update(platoSeleccionado: any, imagen: File | null) {
    try {

      const plato = {
        nombre: platoSeleccionado.nombre,
        descripcion: platoSeleccionado.descripcion,
        calorias: platoSeleccionado.calorias,
        ingredientes: platoSeleccionado.ingredientes,
      }
      const formData = new FormData();
      formData.append("platoSugeridoRequestDTO", JSON.stringify(plato));
      if(imagen){
        formData.append("imagen", imagen);
      }

      const response = await axios.put(`/api/platoSugerido/${platoSeleccionado.idPlatoSugerido}`, formData);
      return response.data
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number) {
    try {
      const response = await axios.delete(`/api/platoSugerido/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new PlatosService();

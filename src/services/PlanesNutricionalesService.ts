import axios from "./api";

const API_URL = "/api/planes";

class PlanesNutricionalesService {
  async getAll() {
    try{
      const response = await axios.get("/api/planesNutricionales");
      return response.data
    }
    catch (error){
      throw error;
    }
  }

  getById(id: number) {
    return axios.get(`${API_URL}/${id}`);
  }

  async create(data: any) {
    try {
      const response = await axios.post("/api/planNutricional", data);
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

export default new PlanesNutricionalesService();

import axios from "./api";

class UsuarioService {

  async getById(id: number) {
    try {
        const response = await axios.get(`/api/usuario/${id}`);
        return response.data
    } catch (error) {
        throw error;
    } 
  }

}

export default new UsuarioService();
import axios from "axios";

// Add this type declaration to fix the error
// Add global type augmentation for ImportMeta to fix the error
declare global {
  interface ImportMetaEnv {
    VITE_API_URL: string;
    // add other env variables if needed
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const API_URL = import.meta.env.VITE_API_URL;
class AlumnosService {
  getAll() {
    return axios.get(API_URL);
  }

  getByEmail(userEmail: string) {
    return axios.get(`/api/alumno/${userEmail}`);
  }

  create(data: any) {
    return axios.post(`${API_URL}/alumnos`);
  }

  update(id: number, data: any) {
    return axios.put(`/api/alumno/${id}`, data);
  }

  delete(id: number) {
    return axios.delete(`/api/alumno/${id}`);
  }
}

export default new AlumnosService();
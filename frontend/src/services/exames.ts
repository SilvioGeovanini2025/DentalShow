import axios from "axios";

const API = "http://localhost:5000";

export function getExames() {
  return axios.get(`${API}/exames`);
}

export function deleteExame(id: number) {
  return axios.delete(`${API}/exames/${id}`);
}

export function uploadExame({ paciente_id, descricao, file }: { paciente_id: string, descricao: string, file: File }) {
  const formData = new FormData();
  formData.append("paciente_id", paciente_id);
  if (descricao) formData.append("descricao", descricao);
  formData.append("file", file);
  return axios.post(`${API}/exames`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}

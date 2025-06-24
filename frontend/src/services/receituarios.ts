import axios from "axios";
const API = "http://localhost:5000/receituarios";

export function getReceituarios() {
  return axios.get(API);
}
export function addReceituario(data: any) {
  return axios.post(API, data);
}
export function deleteReceituario(id: number) {
  return axios.delete(`${API}/${id}`);
}
export function updateReceituario(id: number, dados: { texto: string }) {
  return axios.put(`${API}/${id}`, dados);
}


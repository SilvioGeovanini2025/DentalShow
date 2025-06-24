import axios from "axios";
const API = "http://localhost:5000/prontuarios";

export function getProntuarios() {
  return axios.get(API);
}
export function addProntuario(data: any) {
  return axios.post(API, data);
}
export function deleteProntuario(id: number) {
  return axios.delete(`${API}/${id}`);
}
export function updateProntuario(id: number, dados: { anotacao: string }) {
  return axios.put(`${API}/${id}`, dados);
}

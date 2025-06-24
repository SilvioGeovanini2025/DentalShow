import axios from "axios";
const API = "http://localhost:5000/pagamentos";

// EXPORTAÇÃO NOMEADA!
export type Pagamento = {
  id: number;
  paciente_id: number;
  valor: number;
  forma_pagamento: string;
  data: string;
};

export function getPagamentos() {
  return axios.get(API);
}

export function addPagamento(data: any) {
  return axios.post(API, data);
}

export function updatePagamento(id: number, data: any) {
  return axios.put(`${API}/${id}`, data);
}

export function deletePagamento(id: number) {
  return axios.delete(`${API}/${id}`);
}

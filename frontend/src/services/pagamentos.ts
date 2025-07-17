import api from "./api";
import type { Pagamento } from "../types";

export function getPagamentos() {
  return api.get<Pagamento[]>("/pagamentos");
}

export function getPagamento(id: number) {
  return api.get<Pagamento>(`/pagamentos/${id}`);
}

export function createPagamento(data: Partial<Pagamento>) {
  return api.post("/pagamentos", data);
}

export function updatePagamento(id: number, data: Partial<Pagamento>) {
  return api.put(`/pagamentos/${id}`, data);
}

export function deletePagamento(id: number) {
  return api.delete(`/pagamentos/${id}`);
}

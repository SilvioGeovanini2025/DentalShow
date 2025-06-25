// src/services/servicos.ts
import api from "./api";
import type { Servico } from "../types";

export function getServicos() {
  return api.get<Servico[]>("/ProdutosServicos");
}
export function getServico(id: string | number) {
  return api.get<Servico>(`/ProdutosServicos/${id}`);
}
export function createServico(data: Omit<Servico, "id">) {
  return api.post("/ProdutosServicos", data);
}
export function updateServico(id: number, data: Omit<Servico, "id">) {
  return api.put(`/ProdutosServicos/${id}`, data);
}
export function deleteServico(id: number) {
  return api.delete(`/ProdutosServicos/${id}`);
}

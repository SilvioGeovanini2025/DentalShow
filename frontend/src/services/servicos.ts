// src/services/servicos.ts
import api from "./api";
import type { Servico } from "../types";

export function getServicos() {
  return api.get<Servico[]>("/servicos");
}
export function getServico(id: string | number) {
  return api.get<Servico>(`/servicos/${id}`);
}
export function createServico(data: Omit<Servico, "id">) {
  return api.post("/servicos", data);
}
export function updateServico(id: number, data: Omit<Servico, "id">) {
  return api.put(`/servicos/${id}`, data);
}
export function deleteServico(id: number) {
  return api.delete(`/servicos/${id}`);
}

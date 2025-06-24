import api from "./api";
import type { Produto } from "../types";

export function getProdutos() {
  return api.get<Produto[]>("/produtos");
}

export function getProduto(id: string | number) {
  return api.get<Produto>(`/produtos/${id}`);
}

export function createProduto(data: any) {
  return api.post("/produtos", data);
}

export function updateProduto(id: number, data: any) {
  return api.put(`/produtos/${id}`, data);
}

export function deleteProduto(id: number) {
  return api.delete(`/produtos/${id}`);
}

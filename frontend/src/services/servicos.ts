import api from "./api";
import type { ProdutosServicos } from "../types";

export function getProdutosServicos() {
  return api.get<ProdutosServicos[]>("/ProdutosServicos");
}
export function getProdutosServicosById(id: string | number) {
  return api.get<ProdutosServicos>(`/ProdutosServicos/${id}`);
}
export function createProdutosServicos(data: Omit<ProdutosServicos, "id">) {
  return api.post("/ProdutosServicos", data);
}
export function updateProdutosServicos(id: number, data: Omit<ProdutosServicos, "id">) {
  return api.put(`/ProdutosServicos/${id}`, data);
}
export function deleteProdutosServicos(id: number) {
  return api.delete(`/ProdutosServicos/${id}`);
}

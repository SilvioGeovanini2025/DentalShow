import api from "./api";
import type { ProdutoServico } from "../types";

export async function getProdutosServicos() {
  return api.get<ProdutoServico[]>("/produtosservicos");
}

export async function getProdutoServico(id: number) {
  return api.get<ProdutoServico>(`/produtosservicos/${id}`);
}

export async function createProdutoServico(data: Partial<ProdutoServico>) {
  return api.post("/produtosservicos", data);
}

export async function updateProdutoServico(id: number, data: Partial<ProdutoServico>) {
  return api.put(`/produtosservicos/${id}`, data);
}

export async function deleteProdutoServico(id: number) {
  return api.delete(`/produtosservicos/${id}`);
}

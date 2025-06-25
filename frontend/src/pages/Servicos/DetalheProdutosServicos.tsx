// src/pages/Servicos/DetalheProdutosServicos.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProdutosServicosById } from "../../services/servicos";
import type { ProdutosServicos } from "../../types";

export default function DetalheProdutosServicos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState<ProdutosServicos | null>(null);

  useEffect(() => {
    if (id) {
      getProdutosServicosById(id).then(res => setProduto(res.data));
    }
  }, [id]);

  if (!produto) return <div>Carregando...</div>;

  return (
    <div className="p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
      >
        ← Voltar
      </button>
      <h2 className="text-2xl font-bold mb-4">Detalhes do Produto/Serviço</h2>
      <div className="mb-2"><b>ID:</b> {produto.id}</div>
      <div className="mb-2"><b>Nome:</b> {produto.nome}</div>
      <div className="mb-2"><b>Valor:</b> R$ {Number(produto.valor).toFixed(2)}</div>
      <div className="mb-2"><b>Ativo:</b> {produto.ativo ? "Sim" : "Não"}</div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProdutoServico } from "../../services/produtosservicos";
import type { ProdutoServico } from "../../types";
import { formatarValorBRL } from "../../utils/formatters";

const ProdutoServicoDetalhe: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [produto, setProduto] = useState<ProdutoServico | null>(null);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setCarregando(true);
      getProdutoServico(Number(id))
        .then(res => setProduto(res.data))
        .finally(() => setCarregando(false));
    }
  }, [id]);

  if (carregando) return <div>Carregando...</div>;
  if (!produto) return <div>Produto/Serviço não encontrado.</div>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow mt-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
      >
        ← Voltar
      </button>
      <h2 className="text-2xl font-bold text-center mb-4">Detalhes do Produto/Serviço</h2>
      <div className="mb-2"><strong>ID:</strong> {produto.id}</div>
      <div className="mb-2"><strong>Nome:</strong> {produto.nome}</div>
      <div className="mb-2"><strong>Valor:</strong> {formatarValorBRL(produto.valor)}</div>
      <div className="mb-2"><strong>Descrição:</strong> {produto.descricao}</div>
    </div>
  );
};

export default ProdutoServicoDetalhe;

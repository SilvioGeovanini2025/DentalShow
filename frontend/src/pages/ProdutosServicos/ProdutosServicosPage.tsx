import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProdutosServicos, deleteProdutoServico } from "../../services/produtosservicos";
import ListProdutosServicos from "./ListProdutosServicos";
import type { ProdutoServico } from "../../types";

const ProdutosServicosPage: React.FC = () => {
  const [produtos, setProdutos] = useState<ProdutoServico[]>([]);
  const navigate = useNavigate();

  const fetchProdutos = () => {
    getProdutosServicos()
      .then(res => setProdutos(res.data))
  };

  useEffect(() => { fetchProdutos(); }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Confirma a exclusão?")) {
      await deleteProdutoServico(id);
      fetchProdutos();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-center w-full">Produtos/Serviços</h1>
        <button
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded ml-4"
          onClick={() => navigate("/produtosservicos/novo")}
        >
          Novo Produto/Serviço
        </button>
      </div>
      <ListProdutosServicos
        produtos={produtos}
        onDetalhes={id => navigate(`/produtosservicos/${id}/detalhes`)}
        onEditar={id => navigate(`/produtosservicos/${id}`)}
        onExcluir={handleDelete}
      />
    </div>
  );
};

export default ProdutosServicosPage;

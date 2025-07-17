import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPagamentos, deletePagamento } from "../../services/pagamentos";
import ListPagamentos from "./ListPagamentos";
import type { Pagamento } from "../../types";

const PagamentosPage: React.FC = () => {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const navigate = useNavigate();

  const fetchPagamentos = () => {
    getPagamentos().then(res => setPagamentos(res.data));
  };

  useEffect(() => { fetchPagamentos(); }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Confirma a exclusão?")) {
      await deletePagamento(id);
      fetchPagamentos();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-center w-full">Pagamentos</h1>
        <button
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded ml-4"
          onClick={() => navigate("/pagamentos/novo")}
        >
          Novo Pagamento
        </button>
      </div>
      <ListPagamentos
        pagamentos={pagamentos}
        onEditar={id => navigate(`/pagamentos/${id}`)}
        onExcluir={handleDelete}
      />
    </div>
  );
};

export default PagamentosPage;

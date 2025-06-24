// src/pages/Servicos/ServicoDetalhe.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getServico } from "../../services/servicos";
import type { Servico } from "../../types";

export default function ServicoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [servico, setServico] = useState<Servico | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getServico(id).then(res => setServico(res.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Carregando...</div>;
  if (!servico) return <div>Produto/Serviço não encontrado.</div>;

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
      >← Voltar</button>
      <h2 className="text-2xl font-bold mb-2">Produto/Serviço: {servico.nome}</h2>
      <div className="mb-4">
        <span className="mr-6">ID: {servico.id}</span>
        <span className="mr-6">Valor: R$ {servico.valor.toFixed(2)}</span>
        <span className="mr-6">Ativo: {servico.ativo ? "Sim" : "Não"}</span>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPagamento } from "../../services/pagamentos";
import type { Pagamento } from "../../types";

function formatarValorBRL(valor: number | string): string {
  if (typeof valor === "string") valor = parseFloat(valor.replace(",", "."));
  if (isNaN(valor)) return "R$ 0,00";
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const PagamentoDetalhe: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [pagamento, setPagamento] = useState<Pagamento | null>(null);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setCarregando(true);
      getPagamento(Number(id))
        .then(res => setPagamento(res.data))
        .finally(() => setCarregando(false));
    }
  }, [id]);

  if (carregando) return <div>Carregando...</div>;
  if (!pagamento) return <div>Pagamento não encontrado.</div>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow mt-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
      >
        ← Voltar
      </button>
      <h2 className="text-2xl font-bold text-center mb-4">Detalhes do Pagamento</h2>
      <div className="mb-2"><strong>ID:</strong> {pagamento.id}</div>
      <div className="mb-2"><strong>Paciente:</strong> {pagamento.paciente_nome || pagamento.paciente_id}</div>
      <div className="mb-2"><strong>Valor:</strong> {formatarValorBRL(pagamento.valor)}</div>
      <div className="mb-2"><strong>Forma de Pagamento:</strong> {pagamento.forma_pagamento}</div>
      <div className="mb-2"><strong>Data:</strong> {pagamento.data}</div>
    </div>
  );
};

export default PagamentoDetalhe;

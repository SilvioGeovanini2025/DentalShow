import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAgendamento } from "../../services/agendamentos";
import type { Agendamento } from "../../types";
import { formatarValorBRL } from "../../utils/formatters";

const formatarData = (dataIso: string) => {
  if (!dataIso) return "";
  const d = new Date(dataIso);
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
};

const formatarValor = (valor?: string) => {
  if (!valor || valor === "0" || valor === "0.00" || valor === "0,00") return "0,00";
  if (valor.includes(",")) return valor;
  if (valor.includes(".")) return valor.replace(".", ",");
  return valor;
};

const AgendamentoDetalhe: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [agendamento, setAgendamento] = useState<Agendamento | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (id) {
      setCarregando(true);
      getAgendamento(Number(id))
        .then((res) => setAgendamento(res.data))
        .finally(() => setCarregando(false));
    }
  }, [id]);

  if (carregando) return <div>Carregando...</div>;
  if (!agendamento) return <div>Agendamento não encontrado.</div>;

  return (
    <div className="max-w-xl bg-white p-6 rounded-lg shadow mt-2">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        ← Voltar
      </button>
      <h2 className="text-2xl font-bold mb-4">Detalhes do Agendamento</h2>
      <div className="mb-2"><strong>ID:</strong> {agendamento.id}</div>
      <div className="mb-2"><strong>Paciente:</strong> {agendamento.paciente_nome ?? agendamento.paciente_id}</div>
      <div className="mb-2"><strong>Data:</strong> {formatarData(agendamento.data)}</div>
      <div className="mb-2">
        <strong>Procedimento:</strong> {agendamento.procedimento}
      </div>
      <div className="mb-2">
        <strong>Valor:</strong> R$ {formatarValor(agendamento.valor)}
      </div>
      <div className="mb-2">
        <strong>Observação:</strong> {agendamento.observacao}
      </div>
    </div>
  );
};

export default AgendamentoDetalhe;

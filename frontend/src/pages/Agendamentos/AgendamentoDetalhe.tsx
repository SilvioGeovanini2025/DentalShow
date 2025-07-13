import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAgendamento } from "../../services/agendamentos";
import type { Agendamento } from "../../types";

export default function AgendamentoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agendamento, setAgendamento] = useState<Agendamento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getAgendamento(id).then(res => {
      setAgendamento(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div>Carregando...</div>;
  if (!agendamento) return <div>Agendamento não encontrado.</div>;

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
      >
        ← Voltar
      </button>
      <h2 className="text-2xl font-bold mb-2">Agendamento #{agendamento.id}</h2>
      <div className="mb-4">
        <div><b>Paciente:</b> {agendamento.paciente_nome}</div>
        <div><b>Data:</b> {agendamento.data ? new Date(agendamento.data).toLocaleString("pt-BR") : ""}</div>
        <div><b>Procedimento:</b> {agendamento.procedimento}</div>
        <div><b>Observação:</b> {agendamento.observacao}</div>
      </div>
    </div>
  );
}

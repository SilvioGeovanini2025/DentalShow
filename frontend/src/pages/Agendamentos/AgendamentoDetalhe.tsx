import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAgendamento } from "../../services/agendamentos";

export default function AgendamentoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agendamento, setAgendamento] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getAgendamento(id)
      .then(res => setAgendamento(res.data))
      .finally(() => setLoading(false));
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
      <h2 className="text-2xl font-bold mb-2">Detalhes do Agendamento</h2>
      <div className="mb-2"><strong>ID:</strong> {agendamento.id}</div>
      <div className="mb-2"><strong>Paciente:</strong> {agendamento.paciente_nome}</div>
      <div className="mb-2"><strong>Data:</strong> {agendamento.data}</div>
      <div className="mb-2"><strong>Procedimento:</strong> {agendamento.procedimento}</div>
      {/* Adapte aqui se quiser exibir mais campos */}
    </div>
  );
}

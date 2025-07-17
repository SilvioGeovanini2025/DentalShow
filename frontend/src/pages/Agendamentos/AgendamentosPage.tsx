import { useEffect, useState } from "react";
import { getAgendamentos, deleteAgendamento } from "../../services/agendamentos";
import { useNavigate } from "react-router-dom";
import type { Agendamento } from "../../types";
import ListAgendamentos from "./ListAgendamentos";

export default function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAgendamentos() {
      try {
        const response = await getAgendamentos();
        setAgendamentos(response.data);
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
      }
    }
    fetchAgendamentos();
  }, []);

  function handleDelete(id: number) {
    if (!window.confirm("Deseja realmente excluir?")) return;
    deleteAgendamento(id).then(() =>
      setAgendamentos((prev) => prev.filter((a) => a.id !== id))
    );
  }

  const agendamentosFiltrados = agendamentos.filter((a) => {
    const buscaTrim = busca.trim();
    if (/^\d+$/.test(buscaTrim)) return String(a.id) === buscaTrim;
    const buscaLower = buscaTrim.toLowerCase();
    return [a.procedimento, a.observacao]
      .map((val) => (val ?? "").toLowerCase())
      .some((v) => v.includes(buscaLower));
  });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Agendamentos</h1>
      </div>
      <div className="mb-3 flex justify-between items-center">
        <input
          type="text"
          placeholder="Pesquisar por ID, procedimento, observação..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="border px-3 py-1 rounded w-full max-w-md"
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ml-4"
          onClick={() => navigate("/agendamentos/novo")}
        >
          Novo Agendamento
        </button>
      </div>
      <ListAgendamentos
        agendamentos={agendamentosFiltrados}
        onDetalhes={id => navigate(`/agendamentos/${id}/detalhes`)}
        onEditar={id => navigate(`/agendamentos/${id}`)}
        onExcluir={handleDelete}
      />
    </div>
  );
}

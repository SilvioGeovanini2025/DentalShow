// src/pages/Agendamentos/AgendamentosPage.tsx
import { useEffect, useState } from "react";
import { getAgendamentos, deleteAgendamento } from "../../services/agendamentos";
import { useNavigate } from "react-router-dom";
import type { Agendamento } from "../../types";

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
    deleteAgendamento(id).then(() =>
      setAgendamentos((prev) => prev.filter((a) => a.id !== id))
    );
  }

  // Simples busca por nome ou id (ajuste se quiser mais)
  const agendamentosFiltrados = agendamentos.filter((a) => {
    const buscaTrim = busca.trim().toLowerCase();
    return (
      String(a.id).includes(buscaTrim) ||
      (a.paciente_nome && a.paciente_nome.toLowerCase().includes(buscaTrim))
    );
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Agendamentos</h1>
      <div className="mb-3 flex flex-row items-center gap-4">
        <input
          type="text"
          placeholder="Pesquisar por ID ou paciente..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="border px-3 py-1 rounded w-full max-w-md"
        />
        <div className="flex-1 flex justify-end">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={() => navigate("/agendamentos/novo")}
          >
            Novo Agendamento
          </button>
        </div>
      </div>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-left">ID</th>
            <th className="border px-4 py-2 text-left">Paciente</th>
            <th className="border px-4 py-2 text-left">Data</th>
            <th className="border px-4 py-2 text-left">Procedimento</th>
            <th className="border px-4 py-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {agendamentosFiltrados.map((agendamento) => (
            <tr key={agendamento.id}>
              <td className="border px-4 py-2">{agendamento.id}</td>
              <td className="border px-4 py-2">{agendamento.paciente_nome}</td>
              <td className="border px-4 py-2">{agendamento.data}</td>
              <td className="border px-4 py-2">{agendamento.procedimento}</td>
              <td className="border px-4 py-2 flex flex-row gap-2">
                <button
                  onClick={() => navigate(`/agendamentos/${agendamento.id}/detalhes`)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Detalhes
                </button>
                <button
                  onClick={() => navigate(`/agendamentos/${agendamento.id}`)}
                  className="bg-orange-500 text-white px-2 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(agendamento.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

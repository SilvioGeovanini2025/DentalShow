// src/pages/Pacientes/PacientesPage.tsx
import { useEffect, useState } from "react";
import { getPacientes, deletePaciente } from "../../services/pacientes";
import { useNavigate } from "react-router-dom";
import type { Paciente } from "../../types";

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPacientes() {
      try {
        const response = await getPacientes();
        setPacientes(response.data);
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
      }
    }
    fetchPacientes();
  }, []);

  function handleDelete(id: number) {
    deletePaciente(id).then(() =>
      setPacientes((prev) => prev.filter((p) => p.id !== id))
    );
  }

  // Busca: igualdade no ID, contém nos outros campos
  const pacientesFiltrados = pacientes.filter((p) => {
    const buscaTrim = busca.trim();
    if (/^\d+$/.test(buscaTrim)) return String(p.id) === buscaTrim;
    const buscaLower = buscaTrim.toLowerCase();
    return [p.nome, p.cpf, p.telefone, p.telefone]
      .map((val) => (val ?? "").toLowerCase())
      .some((v) => v.includes(buscaLower));
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Pacientes</h1>
      <div className="mb-3 flex justify-between items-center">
        <input
          type="text"
          placeholder="Pesquisar por ID, nome, CPF, telefone, email..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="border px-3 py-1 rounded w-full max-w-md"
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ml-4"
          onClick={() => navigate("/pacientes/novo")}
        >
          Novo Paciente
        </button>
      </div>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-left">ID</th>
            <th className="border px-4 py-2 text-left">Nome</th>
            <th className="border px-4 py-2 text-left">CPF</th>
            <th className="border px-4 py-2 text-left">Telefone</th>
            <th className="border px-4 py-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {pacientesFiltrados.map((paciente) => (
            <tr key={paciente.id}>
              <td className="border px-4 py-2">{paciente.id}</td>
              <td className="border px-4 py-2">{paciente.nome}</td>
              <td className="border px-4 py-2">{paciente.cpf}</td>
              <td className="border px-4 py-2">{paciente.telefone}</td>
              <td className="border px-4 py-2 flex flex-row gap-2">
                <button
                  onClick={() => navigate(`/pacientes/${paciente.id}/detalhes`)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Detalhes
                </button>
                <button
                  onClick={() => navigate(`/pacientes/${paciente.id}`)}
                  className="bg-orange-500 text-white px-2 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(paciente.id)}
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

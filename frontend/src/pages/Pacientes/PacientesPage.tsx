import { useEffect, useState } from "react";
import { getPacientes, deletePaciente } from "../../services/pacientes";
import { useNavigate } from "react-router-dom";
import type { Paciente } from "../../types";
import ListPacientes from "./ListPacientes";

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
    if (!window.confirm("Deseja realmente excluir?")) return;
    deletePaciente(id).then(() =>
      setPacientes((prev) => prev.filter((p) => p.id !== id))
    );
  }

  const pacientesFiltrados = pacientes.filter((p) => {
    const buscaTrim = busca.trim();
    if (/^\d+$/.test(buscaTrim)) return String(p.id) === buscaTrim;
    const buscaLower = buscaTrim.toLowerCase();
    return [p.nome, p.cpf, p.telefone, p.email]
      .map((val) => (val ?? "").toLowerCase())
      .some((v) => v.includes(buscaLower));
  });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Pacientes</h1>
        <span className="text-lg text-gray-600 font-semibold mr-2">Bem-vindo!</span>
      </div>
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
      <ListPacientes
        pacientes={pacientesFiltrados}
        onDetalhes={id => navigate(`/pacientes/${id}/detalhes`)}
        onEditar={id => navigate(`/pacientes/${id}`)}
        onExcluir={handleDelete}
      />
    </div>
  );
}

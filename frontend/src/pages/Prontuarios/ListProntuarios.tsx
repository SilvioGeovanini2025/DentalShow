import { useEffect, useState } from "react";
import { getProntuarios, deleteProntuario, updateProntuario } from "../../services/prontuarios";
import { getPacientes } from "../../services/pacientes";

type Prontuario = {
  id: number;
  paciente_id: number;
  anotacao: string;
  data: string;
  paciente_nome?: string;
};

type Paciente = {
  id: number;
  nome: string;
};

export default function ListProntuarios() {
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAnotacao, setShowAnotacao] = useState<number | null>(null);
  const [editando, setEditando] = useState<number | null>(null);
  const [novoTexto, setNovoTexto] = useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    const [pront, pacs] = await Promise.all([getProntuarios(), getPacientes()]);
    setProntuarios(
      pront.data.map((p: Prontuario) => ({
        ...p,
        paciente_nome: pacs.data.find((pac: Paciente) => pac.id === p.paciente_id)?.nome || "Paciente não encontrado"
      }))
    );
    setPacientes(pacs.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Deseja realmente excluir este prontuário?")) {
      await deleteProntuario(id);
      fetchData();
    }
  };

  const handleEdit = (prontuario: Prontuario) => {
    setEditando(prontuario.id);
    setNovoTexto(prontuario.anotacao);
  };

  const handleSalvar = async (id: number) => {
    await updateProntuario(id, { anotacao: novoTexto });
    setEditando(null);
    setNovoTexto("");
    fetchData();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Prontuários</h2>
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <table className="min-w-full bg-white shadow rounded-xl">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Paciente</th>
              <th className="py-2 px-4 text-left">Anotação</th>
              <th className="py-2 px-4 text-left">Data</th>
              <th className="py-2 px-4 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {prontuarios.map((pront) => (
              <tr key={pront.id} className="border-t">
                <td className="py-2 px-4">{pront.id}</td>
                <td className="py-2 px-4">{pront.paciente_nome}</td>
                <td className="py-2 px-4">
                  {editando === pront.id ? (
                    <textarea
                      className="border rounded px-2 py-1 w-full"
                      value={novoTexto}
                      onChange={e => setNovoTexto(e.target.value)}
                    />
                  ) : (
                    <span>
                      {pront.anotacao.length > 60
                        ? pront.anotacao.substring(0, 60) + "..."
                        : pront.anotacao}
                    </span>
                  )}
                </td>
                <td className="py-2 px-4">{pront.data}</td>
                <td className="py-2 px-4 flex gap-2 items-center">
                  {/* Excluir */}
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(pront.id)}
                  >
                    Excluir
                  </button>
                  {/* Editar */}
                  {editando === pront.id ? (
                    <button
                      className="bg-orange-500 hover:bg-orange-700 text-white px-3 py-1 rounded"
                      onClick={() => handleSalvar(pront.id)}
                    >
                      Salvar
                    </button>
                  ) : (
                    <button
                      className="bg-orange-500 hover:bg-orange-700 text-white px-3 py-1 rounded"
                      onClick={() => handleEdit(pront)}
                    >
                      Editar
                    </button>
                  )}
                  {/* Visualizar */}
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded"
                    onClick={() => setShowAnotacao(showAnotacao === pront.id ? null : pront.id)}
                  >
                    Visualizar
                  </button>
                  {showAnotacao === pront.id && (
                    <div className="absolute z-50 bg-white text-black p-4 rounded-xl shadow-xl border w-96 left-1/2 -translate-x-1/2 mt-2">
                      <div className="mb-2 font-bold text-blue-900">Anotação completa:</div>
                      <div className="whitespace-pre-wrap break-words">{pront.anotacao}</div>
                      <button
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded"
                        onClick={() => setShowAnotacao(null)}
                      >
                        Fechar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {prontuarios.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-8">
                  Nenhum prontuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

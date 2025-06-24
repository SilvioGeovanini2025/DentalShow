import { useEffect, useState } from "react";
import { getReceituarios, deleteReceituario, updateReceituario } from "../../services/receituarios";
import { getPacientes } from "../../services/pacientes";

type Receituario = {
  id: number;
  paciente_id: number;
  texto: string;
  data: string;
};

type Paciente = {
  id: number;
  nome: string;
};

export default function ListReceituarios() {
  const [receituarios, setReceituarios] = useState<Receituario[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);

  // Novos states para edição
  const [editId, setEditId] = useState<number | null>(null);
  const [editTexto, setEditTexto] = useState("");

  useEffect(() => {
    Promise.all([getReceituarios(), getPacientes()])
      .then(([resRec, resPacs]) => {
        setReceituarios(resRec.data);
        setPacientes(resPacs.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const getPacienteNome = (id: number) => {
    const p = pacientes.find(p => p.id === id);
    return p ? p.nome : "Paciente não encontrado";
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja excluir este receituário?")) return;
    await deleteReceituario(id);
    setReceituarios(receituarios.filter(r => r.id !== id));
  };

  const handleEdit = (rec: Receituario) => {
    setEditId(rec.id);
    setEditTexto(rec.texto);
  };

  const handleSaveEdit = async (id: number) => {
    await updateReceituario(id, { texto: editTexto });
    setReceituarios(rs => rs.map(r => r.id === id ? { ...r, texto: editTexto } : r));
    setEditId(null);
    setEditTexto("");
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditTexto("");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Receituários</h2>
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <table className="min-w-full bg-white shadow rounded-xl">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Paciente</th>
              <th className="py-2 px-4 text-left">Texto</th>
              <th className="py-2 px-4 text-left">Data</th>
              <th className="py-2 px-4 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {receituarios.map(rec => (
              <tr key={rec.id} className="border-t">
                <td className="py-2 px-4">{rec.id}</td>
                <td className="py-2 px-4">{getPacienteNome(rec.paciente_id)}</td>
                <td className="py-2 px-4 max-w-xs truncate" title={rec.texto}>
                  {editId === rec.id ? (
                    <input
                      className="border px-2 py-1 rounded w-full"
                      value={editTexto}
                      onChange={e => setEditTexto(e.target.value)}
                      autoFocus
                    />
                  ) : rec.texto}
                </td>
                <td className="py-2 px-4">{rec.data}</td>
                <td className="py-2 px-4 flex gap-2 items-center">
                  {/* Excluir sempre à esquerda, vermelho */}
                  <button
                    onClick={() => handleDelete(rec.id)}
                    className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Excluir
                  </button>
                  {/* Edição no meio */}
                  {editId === rec.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(rec.id)}
                        className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-400 hover:bg-gray-600 text-white px-3 py-1 rounded"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEdit(rec)}
                      className="bg-orange-400 hover:bg-orange-600 text-white px-3 py-1 rounded"
                    >
                      Editar
                    </button>
                  )}
                  {/* Visualizar sempre à direita, verde */}
                  <button
                    onClick={() => alert(rec.texto)}
                    className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded"
                  >
                    Visualizar
                  </button>
                </td>
              </tr>
            ))}
            {receituarios.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-8">
                  Nenhum receituário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

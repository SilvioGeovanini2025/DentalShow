import { useEffect, useState } from "react";
import { getExames, deleteExame } from "../../services/exames";

type Exame = {
  id: number;
  paciente_id: number;
  filename: string;
  descricao: string;
  data_upload: string;
};

export default function ListExames() {
  const [exames, setExames] = useState<Exame[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExames = () => {
    setLoading(true);
    getExames()
      .then((res) => setExames(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchExames();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja excluir este exame?")) return;
    await deleteExame(id);
    fetchExames();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Exames</h2>
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <table className="min-w-full bg-white shadow rounded-xl">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Paciente</th>
              <th className="py-2 px-4 text-left">Arquivo</th>
              <th className="py-2 px-4 text-left">Descrição</th>
              <th className="py-2 px-4 text-left">Data Upload</th>
              <th className="py-2 px-4 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {exames.map((exame) => (
              <tr key={exame.id} className="border-t">
                <td className="py-2 px-4">{exame.id}</td>
                <td className="py-2 px-4">{exame.paciente_id}</td>
                <td className="py-2 px-4">{exame.filename}</td>
                <td className="py-2 px-4">{exame.descricao}</td>
                <td className="py-2 px-4">{exame.data_upload}</td>
                <td className="py-2 px-4 flex gap-2 items-center">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(exame.id)}
                  >
                    Excluir
                  </button>
                  <a
                    href={`http://localhost:5000/exames/${exame.id}/download`}
                    className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    Baixar
                  </a>
                  <a
                    href={`http://localhost:5000/exames/${exame.id}/visualizar`}
                    className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visualizar
                  </a>
                </td>
              </tr>
            ))}
            {exames.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-8">
                  Nenhum exame encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

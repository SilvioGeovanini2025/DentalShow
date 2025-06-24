// src/pages/Servicos/ServicosPage.tsx
import { useEffect, useState } from "react";
import { getServicos, deleteServico } from "../../services/servicos";
import { useNavigate } from "react-router-dom";
import type { Servico } from "../../types";

export default function ServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetch() {
      const resp = await getServicos();
      setServicos(resp.data);
    }
    fetch();
  }, []);

  // Busca igual por ID, inclui nos outros campos
  const filtrados = servicos.filter(s => {
    const buscaTrim = busca.trim();
    if (/^\d+$/.test(buscaTrim)) return String(s.id) === buscaTrim;
    const buscaLower = buscaTrim.toLowerCase();
    return (
      s.nome.toLowerCase().includes(buscaLower) ||
      String(s.valor).includes(buscaLower)
    );
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Produtos/Serviços</h1>
      <div className="mb-3 flex flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Pesquisar por ID, nome, valor..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="border px-3 py-1 rounded w-full max-w-md"
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={() => navigate("/servicos/novo")}
        >
          Novo Produto/Serviço
        </button>
      </div>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-left">ID</th>
            <th className="border px-4 py-2 text-left">Nome</th>
            <th className="border px-4 py-2 text-left">Valor</th>
            <th className="border px-4 py-2 text-left">Ativo</th>
            <th className="border px-4 py-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map(s => (
            <tr key={s.id}>
              <td className="border px-4 py-2">{s.id}</td>
              <td className="border px-4 py-2">{s.nome}</td>
              <td className="border px-4 py-2">R$ {s.valor.toFixed(2)}</td>
              <td className="border px-4 py-2">{s.ativo ? "Sim" : "Não"}</td>
              <td className="border px-4 py-2 flex flex-row gap-2">
                <button
                  onClick={() => navigate(`/servicos/${s.id}/detalhes`)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >Detalhes</button>
                <button
                  onClick={() => navigate(`/servicos/${s.id}`)}
                  className="bg-orange-500 text-white px-2 py-1 rounded"
                >Editar</button>
                <button
                  onClick={() => {
                    if (window.confirm("Confirma exclusão?")) deleteServico(s.id).then(() => setServicos(v => v.filter(x => x.id !== s.id)));
                  }}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

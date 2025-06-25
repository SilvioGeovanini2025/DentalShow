// src/pages/Servicos/ProdutosServicosPage.tsx
import { useEffect, useState } from "react";
import { getProdutosServicos, deleteProdutosServicos } from "../../services/servicos";
import { useNavigate } from "react-router-dom";
import type { ProdutosServicos } from "../../types";

export default function ProdutosServicosPage() {
  const [produtos, setProdutos] = useState<ProdutosServicos[]>([]);
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getProdutosServicos().then(res => setProdutos(res.data));
  }, []);

  function handleDelete(id: number) {
    if (!window.confirm("Tem certeza que deseja excluir?")) return;
    deleteProdutosServicos(id).then(() =>
      setProdutos(prev => prev.filter((p) => p.id !== id))
    );
  }

  const filtrados = produtos.filter((p) => {
    const buscaTrim = busca.trim().toLowerCase();
    if (/^\d+$/.test(buscaTrim)) return String(p.id) === buscaTrim;
    return [p.nome, p.valor].some((val) =>
      String(val ?? "").toLowerCase().includes(buscaTrim)
    );
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Produtos/Serviços</h1>
      <div className="mb-3 flex flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Pesquisar por ID, nome ou valor..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="border px-3 py-1 rounded w-full max-w-md"
        />
        <div className="flex-1 flex justify-end">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={() => navigate("/servicos/novo")}
          >
            Novo Produto
          </button>
        </div>
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
          {filtrados.map((p) => (
            <tr key={p.id}>
              <td className="border px-4 py-2">{p.id}</td>
              <td className="border px-4 py-2">{p.nome}</td>
              <td className="border px-4 py-2">R$ {Number(p.valor).toFixed(2)}</td>
              <td className="border px-4 py-2">{p.ativo ? "Sim" : "Não"}</td>
              <td className="border px-4 py-2 flex flex-row gap-2">
                <button
                  onClick={() => navigate(`/servicos/${p.id}/detalhes`)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Detalhes
                </button>
                <button
                  onClick={() => navigate(`/servicos/${p.id}`)}
                  className="bg-orange-500 text-white px-2 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
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

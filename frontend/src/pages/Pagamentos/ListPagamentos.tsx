import { useEffect, useState } from "react";
import { deletePagamento } from "../../services/pagamentos";
import type { Pagamento } from "../../services/pagamentos";
import { getPacientes } from "../../services/pacientes";

type Props = {
  pagamentos: Pagamento[];
  setEdit: (pagamento: Pagamento) => void;
  refreshList: () => void;
};

export default function ListPagamentos({ pagamentos, setEdit, refreshList }: Props) {
  const [pacientes, setPacientes] = useState<{ id: number; nome: string }[]>([]);

  useEffect(() => {
    getPacientes().then(res => setPacientes(res.data));
  }, []);

  const getPacienteNome = (id: number) => {
    const p = pacientes.find(p => p.id === id);
    return p ? p.nome : "Paciente não encontrado";
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja excluir este pagamento?")) return;
    await deletePagamento(id);
    refreshList();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Pagamentos</h2>
      <table className="min-w-full bg-white shadow rounded-xl">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left">ID</th>
            <th className="py-2 px-4 text-left">Paciente</th>
            <th className="py-2 px-4 text-left">Valor (R$)</th>
            <th className="py-2 px-4 text-left">Forma</th>
            <th className="py-2 px-4 text-left">Data</th>
            <th className="py-2 px-4 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {pagamentos.map(p => (
            <tr key={p.id} className="border-t">
              <td className="py-2 px-4">{p.id}</td>
              <td className="py-2 px-4">{getPacienteNome(p.paciente_id)}</td>
              <td className="py-2 px-4">R$ {Number(p.valor).toFixed(2)}</td>
              <td className="py-2 px-4">{p.forma_pagamento}</td>
              <td className="py-2 px-4">{p.data}</td>
              <td className="py-2 px-4 flex gap-2">
                <button
                  className="bg-orange-500 hover:bg-orange-700 text-white px-3 py-1 rounded"
                  onClick={() => setEdit(p)}
                >
                  Editar
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(p.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
          {pagamentos.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center text-gray-400 py-8">
                Nenhum pagamento encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

import React from "react";
import type { Agendamento } from "../../types";
import { formatarValorBRL } from "../../utils/formatters";

interface ListAgendamentosProps {
  agendamentos: Agendamento[];
  onDetalhes: (id: number) => void;
  onEditar: (id: number) => void;
  onExcluir: (id: number) => void;
}

const formatarData = (dataIso: string) => {
  if (!dataIso) return "";
  const d = new Date(dataIso);
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
};

const ListAgendamentos: React.FC<ListAgendamentosProps> = ({
  agendamentos,
  onDetalhes,
  onEditar,
  onExcluir,
}) => (
  <table className="min-w-full">
    <thead>
      <tr>
        <th className="border px-4 py-2 text-left">ID</th>
        <th className="border px-4 py-2 text-left">Paciente</th>
        <th className="border px-4 py-2 text-left">Data</th>
        <th className="border px-4 py-2 text-left">Procedimento</th>
        <th className="border px-4 py-2 text-left">Valor</th>
        <th className="border px-4 py-2 text-left">Ações</th>
      </tr>
    </thead>
    <tbody>
      {agendamentos.map((a) => (
        <tr key={a.id}>
          <td className="border px-4 py-2">{a.id}</td>
          <td className="border px-4 py-2">{a.paciente_nome ?? a.paciente_id}</td>
          <td className="border px-4 py-2">{formatarData(a.data)}</td>
          <td className="border px-4 py-2">{a.procedimento}</td>
          <td className="border px-4 py-2">R$ {a.valor}</td>
          <td className="border px-4 py-2 flex flex-row gap-2">
            <button
              onClick={() => onDetalhes(a.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded shadow"
            >
              Detalhes
            </button>
            <button
              onClick={() => onEditar(a.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded shadow"
            >
              Editar
            </button>
            <button
              onClick={() => onExcluir(a.id)}
              className="bg-blue-600 hover:bg-red-600 text-white px-3 py-1 rounded shadow"
            >
              Excluir
            </button>
          </td>
        </tr>
      ))}
      {agendamentos.length === 0 && (
        <tr>
          <td colSpan={6} className="text-center text-gray-400 py-8">
            Nenhum agendamento encontrado.
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

export default ListAgendamentos;

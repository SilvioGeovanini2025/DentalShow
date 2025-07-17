import React from "react";
import type { Pagamento } from "../../types";
import { formatarValorBRL } from "../../utils/formatters";

// Função utilitária para formatar data no padrão BR (dd/mm/yyyy HH:MM)
function formatarData(dataString?: string) {
  if (!dataString) return "";
  // Aceita tanto "YYYY-MM-DD HH:mm" quanto ISO, e retorna "dd/mm/yyyy HH:mm"
  const [datePart, timePart] = dataString.split(" ");
  if (!datePart) return dataString;
  const [ano, mes, dia] = datePart.split("-");
  if (!ano || !mes || !dia) return dataString;
  return `${dia}/${mes}/${ano}` + (timePart ? ` ${timePart}` : "");
}

interface Props {
  pagamentos: Pagamento[];
  onEditar: (id: number) => void;
  onExcluir: (id: number) => void;
}

const ListPagamentos: React.FC<Props> = ({
  pagamentos,
  onEditar,
  onExcluir,
}) => (
  <table className="min-w-full bg-white rounded shadow">
    <thead>
      <tr>
        <th className="px-4 py-2">ID</th>
        <th className="px-4 py-2">Paciente</th>
        <th className="px-4 py-2">Valor</th>
        <th className="px-4 py-2">Forma de Pagamento</th>
        <th className="px-4 py-2">Data</th>
        <th className="px-4 py-2">Ações</th>
      </tr>
    </thead>
    <tbody>
      {pagamentos.map(pag => (
        <tr key={pag.id}>
          <td className="border px-4 py-2">{pag.id}</td>
          <td className="border px-4 py-2">{pag.paciente_nome || pag.paciente_id}</td>
          <td className="border px-4 py-2">{formatarValorBRL(pag.valor)}</td>
          <td className="border px-4 py-2">{pag.forma_pagamento}</td>
          <td className="border px-4 py-2">{formatarData(pag.data)}</td>
          <td className="border px-4 py-2 flex gap-2">
            <button className="bg-blue-700 text-white px-3 py-1 rounded" onClick={() => onEditar(pag.id)}>Editar</button>
            <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => onExcluir(pag.id)}>Excluir</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ListPagamentos;

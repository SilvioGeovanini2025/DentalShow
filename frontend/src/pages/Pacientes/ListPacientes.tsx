import React from "react";
import type { Paciente } from "../../types";

interface ListPacientesProps {
  pacientes: Paciente[];
  onDetalhes: (id: number) => void;
  onEditar: (id: number) => void;
  onExcluir: (id: number) => void;
}

const ListPacientes: React.FC<ListPacientesProps> = ({
  pacientes,
  onDetalhes,
  onEditar,
  onExcluir,
}) => (
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
      {pacientes.map((paciente) => (
        <tr key={paciente.id}>
          <td className="border px-4 py-2">{paciente.id}</td>
          <td className="border px-4 py-2">{paciente.nome}</td>
          <td className="border px-4 py-2">{paciente.cpf}</td>
          <td className="border px-4 py-2">{paciente.telefone}</td>
          <td className="border px-4 py-2 flex flex-row gap-2">
            <button
              onClick={() => onDetalhes(paciente.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded shadow"
            >
              Detalhes
            </button>
            <button
              onClick={() => onEditar(paciente.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded shadow"
            >
              Editar
            </button>
            <button
              onClick={() => onExcluir(paciente.id)}
              className="bg-blue-600 hover:bg-red-600 text-white px-3 py-1 rounded shadow"
            >
              Excluir
            </button>
          </td>
        </tr>
      ))}
      {pacientes.length === 0 && (
        <tr>
          <td colSpan={5} className="text-center text-gray-400 py-8">
            Nenhum paciente encontrado.
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

export default ListPacientes;

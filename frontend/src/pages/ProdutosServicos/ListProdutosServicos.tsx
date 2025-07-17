import React from "react";
import type { ProdutoServico } from "../../types";
import { formatarValorBRL } from "../../utils/formatters";

interface Props {
  produtos: ProdutoServico[];
  onDetalhes: (id: number) => void;
  onEditar: (id: number) => void;
  onExcluir: (id: number) => void;
}

const ListProdutosServicos: React.FC<Props> = ({
  produtos,
  onDetalhes,
  onEditar,
  onExcluir,
}) => (
  <table className="min-w-full bg-white rounded shadow">
    <thead>
      <tr>
        <th className="px-4 py-2">ID</th>
        <th className="px-4 py-2">Nome</th>
        <th className="px-4 py-2">Valor</th>
        <th className="px-4 py-2">Ações</th>
      </tr>
    </thead>
    <tbody>
      {produtos.map(prod => (
        <tr key={prod.id}>
          <td className="border px-4 py-2">{prod.id}</td>
          <td className="border px-4 py-2">{prod.nome}</td>
          <td className="border px-4 py-2">{formatarValorBRL(prod.valor)}</td>
          <td className="border px-4 py-2 flex gap-2">
            <button className="bg-blue-700 text-white px-3 py-1 rounded" onClick={() => onDetalhes(prod.id)}>Detalhes</button>
            <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => onEditar(prod.id)}>Editar</button>
            <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => onExcluir(prod.id)}>Excluir</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ListProdutosServicos;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProdutoServico, createProdutoServico, updateProdutoServico } from "../../services/produtosservicos";
import type { ProdutoServico } from "../../types";

const FormProdutoServico: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [produto, setProduto] = useState<Partial<ProdutoServico>>({
    nome: "",
    valor: "",
    descricao: "",
  });
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (id) {
      setCarregando(true);
      getProdutoServico(Number(id))
        .then(res => setProduto(res.data))
        .finally(() => setCarregando(false));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduto(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    if (id) {
      await updateProdutoServico(Number(id), produto);
    } else {
      await createProdutoServico(produto);
    }
    setCarregando(false);
    navigate("/produtosservicos");
  };

  const handleCancel = () => navigate("/produtosservicos");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          {id ? "Editar" : "Novo"} Produto/Serviço
        </h2>
        <div className="mb-5">
          <label className="block mb-1 font-semibold">Nome</label>
          <input
            name="nome"
            value={produto.nome ?? ""}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 w-full focus:outline-blue-700"
          />
        </div>
        <div className="mb-5">
          <label className="block mb-1 font-semibold">Valor</label>
          <input
            name="valor"
            value={produto.valor ?? ""}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 w-full focus:outline-blue-700"
            placeholder="Ex: 200,00"
          />
        </div>
        <div className="mb-5">
          <label className="block mb-1 font-semibold">Descrição</label>
          <textarea
            name="descricao"
            value={produto.descricao ?? ""}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full focus:outline-blue-700"
            rows={3}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded shadow transition"
            disabled={carregando}
          >
            {carregando ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow transition"
            onClick={handleCancel}
            disabled={carregando}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormProdutoServico;

// src/pages/Servicos/FormProdutosServicos.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProdutosServicos, getProdutosServicosById, updateProdutosServicos } from "../../services/servicos";
import type { ProdutosServicos } from "../../types";

export default function FormProdutosServicos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<Omit<ProdutosServicos, "id">>({
    nome: "",
    valor: 0,
    ativo: true,
  });

  useEffect(() => {
    if (id) {
      getProdutosServicosById(id).then(res => setForm(res.data));
    }
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "valor"
        ? Number(value.replace(",", "."))
        : (type === "checkbox" ? (e.target as HTMLInputElement).checked : value)
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (id) {
      await updateProdutosServicos(Number(id), form);
    } else {
      await createProdutosServicos(form);
    }
    navigate("/servicos");
  }

  function handleCancel() {
    navigate("/servicos");
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{id ? "Editar" : "Novo"} Produto/Serviço</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="block">Nome:</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
            className="w-full border px-3 py-1 rounded"
          />
        </div>
        <div>
          <label className="block">Valor (R$):</label>
          <input
            type="number"
            step="0.01"
            name="valor"
            value={form.valor}
            onChange={handleChange}
            required
            className="w-full border px-3 py-1 rounded"
            placeholder="Ex: 150,00"
          />
        </div>
        <div className="flex items-center gap-2">
          <label>Ativo:</label>
          <input
            type="checkbox"
            name="ativo"
            checked={form.ativo}
            onChange={handleChange}
            className="h-5 w-5"
          />
        </div>
        <div className="flex gap-4">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Salvar
          </button>
          <button type="button" onClick={handleCancel} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

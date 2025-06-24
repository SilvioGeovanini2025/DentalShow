// src/pages/Servicos/FormServico.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createServico, getServico, updateServico } from "../../services/servicos";
import type { Servico } from "../../types";

export default function FormServico() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    valor: "",
    ativo: true,
  });

  useEffect(() => {
    if (id) {
      getServico(id).then(res => {
        setForm({
          ...res.data,
          valor: String(res.data.valor ?? ""),
        });
      });    
    }
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value
          ? Number(value.replace(",", "."))
          : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formToSend = {
      ...form,
      valor: Number(String(form.valor).replace(",", "."))
    };
    if (id) {
      await updateServico(Number(id), formToSend);
    } else {
      await createServico(formToSend);
    }
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
          />
        </div>
        <div className="flex items-center gap-2">
          <label>Ativo:</label>
          <input
            type="text"
            name="valor"
            value={form.valor}
            onChange={handleChange}
            required
            className="w-full border px-3 py-1 rounded"
            placeholder="Ex: 150,00"
          />
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Salvar
        </button>
      </form>
    </div>
  );
}

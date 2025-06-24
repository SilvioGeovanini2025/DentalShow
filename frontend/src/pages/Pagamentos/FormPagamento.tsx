import { useEffect, useState } from "react";
import { getPacientes } from "../../services/pacientes";
import { addPagamento, updatePagamento } from "../../services/pagamentos";
import type { Pagamento } from "../../services/pagamentos";

const formas = [
  "Dinheiro",
  "PIX",
  "Cartão de Débito",
  "Cartão de Crédito",
  "Cheque",
  "Boleto"
];

type Props = {
  pagamento?: Pagamento | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function FormPagamento({ pagamento, onSuccess, onCancel }: Props) {
  const [pacientes, setPacientes] = useState<{ id: number; nome: string }[]>([]);
  const [form, setForm] = useState({
    paciente_id: "",
    valor: "",
    forma_pagamento: formas[0]
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPacientes().then(res => setPacientes(res.data));
  }, []);

  useEffect(() => {
    setForm({
      paciente_id: pagamento?.paciente_id?.toString() || "",
      valor: pagamento?.valor?.toString() || "",
      forma_pagamento: pagamento?.forma_pagamento || formas[0]
    });
  }, [pagamento]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (pagamento && pagamento.id) {
      await updatePagamento(pagamento.id, {
        ...form,
        valor: parseFloat(form.valor)
      });
    } else {
      await addPagamento({
        ...form,
        valor: parseFloat(form.valor)
      });
    }
    setLoading(false);
    onSuccess();
    setForm({
      paciente_id: "",
      valor: "",
      forma_pagamento: formas[0]
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex flex-wrap gap-4 items-end">
      <div>
        <label className="block text-sm">Paciente</label>
        <select
          name="paciente_id"
          value={form.paciente_id}
          onChange={handleChange}
          required
          className="border rounded px-2 py-1 w-48"
          disabled={!!pagamento}
        >
          <option value="">Selecione...</option>
          {pacientes.map(p => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm">Valor (R$)</label>
        <input
          type="number"
          step="0.01"
          name="valor"
          value={form.valor}
          onChange={handleChange}
          required
          className="border rounded px-2 py-1 w-32"
        />
      </div>
      <div>
        <label className="block text-sm">Forma de Pagamento</label>
        <select
          name="forma_pagamento"
          value={form.forma_pagamento}
          onChange={handleChange}
          required
          className="border rounded px-2 py-1 w-44"
        >
          {formas.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {pagamento ? "Salvar" : "Adicionar"}
      </button>
      {pagamento && (
        <button
          type="button"
          onClick={onCancel}
          className="ml-2 bg-gray-400 hover:bg-gray-600 text-white px-3 py-2 rounded"
        >
          Cancelar
        </button>
      )}
    </form>
  );
}

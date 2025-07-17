import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPagamento, createPagamento, updatePagamento } from "../../services/pagamentos";
import { getPacientes } from "../../services/pacientes";
import type { Pagamento, Paciente } from "../../types";

const FORMAS_PAGAMENTO = [
  "Dinheiro",
  "Pix",
  "Cartão de Crédito",
  "Cartão de Débito",
  "Transferência"
];

const FormPagamento: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  // paciente_id: number, valor: string (para aceitar digitação)
  const [pagamento, setPagamento] = useState<Partial<Pagamento>>({
    paciente_id: undefined,
    valor: "",
    forma_pagamento: "",
  });
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    getPacientes().then(res => setPacientes(res.data));
    if (id) {
      setCarregando(true);
      getPagamento(Number(id))
        .then(res => setPagamento({
          ...res.data,
          valor: res.data.valor?.toString().replace(".", ",") // mostra valor com vírgula para edição
        }))
        .finally(() => setCarregando(false));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPagamento(prev => ({
      ...prev,
      [name]:
        name === "paciente_id" ? Number(value) :
        value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    const payload = {
      ...pagamento,
      paciente_id: Number(pagamento.paciente_id),
      valor: typeof pagamento.valor === "string"
        ? Number(pagamento.valor.replace(",", "."))
        : pagamento.valor
    };
    if (id) {
      await updatePagamento(Number(id), payload);
    } else {
      await createPagamento(payload);
    }
    setCarregando(false);
    navigate("/pagamentos");
  };

  const handleCancel = () => navigate("/pagamentos");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">{id ? "Editar" : "Novo"} Pagamento</h2>
        <div className="mb-5">
          <label className="block mb-1 font-semibold">Paciente</label>
          <select
            name="paciente_id"
            value={pagamento.paciente_id ?? ""}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Selecione</option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        </div>
        <div className="mb-5">
          <label className="block mb-1 font-semibold">Valor</label>
          <input
            name="valor"
            value={pagamento.valor ?? ""}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 w-full"
            placeholder="Ex: 200,00"
            inputMode="decimal"
          />
        </div>
        <div className="mb-5">
          <label className="block mb-1 font-semibold">Forma de Pagamento</label>
          <select
            name="forma_pagamento"
            value={pagamento.forma_pagamento ?? ""}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Selecione</option>
            {FORMAS_PAGAMENTO.map((forma) => (
              <option key={forma} value={forma}>{forma}</option>
            ))}
          </select>
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

export default FormPagamento;

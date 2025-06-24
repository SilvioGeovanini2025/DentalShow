// src/pages/Pacientes/FormPaciente.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createPaciente, getPaciente, updatePaciente } from "../../services/pacientes";

export default function FormPaciente() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    endereco: "",
  });

  useEffect(() => {
    if (id) {
      getPaciente(id).then((res) => setForm(res.data));
    }
  }, [id]);

  function formatCPF(value: string) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function formatTelefone(value: string) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "nome") {
      newValue = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ""); // Apenas letras e acentos
    }
    if (name === "cpf") {
      newValue = formatCPF(value);
    }
    if (name === "telefone") {
      newValue = formatTelefone(value);
    }

    setForm((prev) => ({ ...prev, [name]: newValue }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (id) {
      await updatePaciente(Number(id), form);
    } else {
      await createPaciente(form);
    }
    navigate("/pacientes");
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{id ? "Editar" : "Novo"} Paciente</h2>
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
          <label className="block">CPF:</label>
          <input
            type="text"
            name="cpf"
            value={form.cpf}
            onChange={handleChange}
            required
            maxLength={14}
            className="w-full border px-3 py-1 rounded"
          />
        </div>
        <div>
          <label className="block">Telefone:</label>
          <input
            type="text"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            required
            maxLength={15}
            className="w-full border px-3 py-1 rounded"
          />
        </div>
        <div>
          <label className="block">Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-1 rounded"
          />
        </div>
        <div>
          <label className="block">Endereço:</label>
          <input
            type="text"
            name="endereco"
            value={form.endereco}
            onChange={handleChange}
            className="w-full border px-3 py-1 rounded"
          />
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Salvar
        </button>
      </form>
    </div>
  );
}

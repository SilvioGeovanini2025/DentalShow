import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createPaciente, updatePaciente, getPaciente } from "../../services/pacientes";
import type { Paciente } from "../../types";

const apenasLetras = (value: string) =>
  value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");

const mascaraCPF = (value: string) => {
  // Remove tudo que não é número
  value = value.replace(/\D/g, "");
  // Aplica a máscara
  return value
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2")
    .slice(0, 14);
};

const mascaraTelefone = (value: string) => {
  value = value.replace(/\D/g, "");
  value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
  value = value.replace(/(\d{5})(\d)/, "$1-$2");
  return value.slice(0, 15);
};

const FormPaciente: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [paciente, setPaciente] = useState<Paciente>({
    id: 0,
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    endereco: "",
  });
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (id) {
      setCarregando(true);
      getPaciente(Number(id))
        .then((response) => setPaciente(response.data))
        .finally(() => setCarregando(false));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "nome") {
      setPaciente({ ...paciente, [name]: apenasLetras(value) });
    } else if (name === "cpf") {
      setPaciente({ ...paciente, [name]: mascaraCPF(value) });
    } else if (name === "telefone") {
      setPaciente({ ...paciente, [name]: mascaraTelefone(value) });
    } else {
      setPaciente({ ...paciente, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    try {
      if (id) {
        await updatePaciente(Number(id), paciente);
      } else {
        await createPaciente(paciente);
      }
      navigate("/pacientes");
    } catch (error) {
      alert("Erro ao salvar paciente!");
    } finally {
      setCarregando(false);
    }
  };

  const handleCancelar = () => {
    navigate("/pacientes");
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">{id ? "Editar Paciente" : "Novo Paciente"}</h2>
      {carregando ? (
        <div>Carregando...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Nome</label>
            <input
              type="text"
              name="nome"
              value={paciente.nome}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Endereço</label>
            <input
              type="text"
              name="endereco"
              value={paciente.endereco}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">CPF</label>
            <input
              type="text"
              name="cpf"
              value={paciente.cpf}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
              maxLength={14}
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Telefone</label>
            <input
              type="text"
              name="telefone"
              value={paciente.telefone}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
              maxLength={15}
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={paciente.email}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
              disabled={carregando}
            >
              Salvar
            </button>
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
              onClick={handleCancelar}
              disabled={carregando}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FormPaciente;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPaciente } from "../../services/pacientes";
import type { Paciente } from "../../types";

const PacienteDetalhe: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (id) {
      setCarregando(true);
      getPaciente(Number(id))
        .then((response) => setPaciente(response.data))
        .finally(() => setCarregando(false));
    }
  }, [id]);

  if (carregando) {
    return <div>Carregando...</div>;
  }

  if (!paciente) {
    return <div>Paciente não encontrado.</div>;
  }

  return (
    <div className="max-w-xl bg-white p-6 rounded-lg shadow mt-2">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        ← Voltar
      </button>
      <h2 className="text-2xl font-bold mb-4">Detalhes do Paciente</h2>
      <div className="mb-2"><strong>Nome:</strong> {paciente.nome}</div>
      <div className="mb-2"><strong>Endereço:</strong> {paciente.endereco}</div>
      <div className="mb-2"><strong>CPF:</strong> {paciente.cpf}</div>
      <div className="mb-2"><strong>Telefone:</strong> {paciente.telefone}</div>
      <div className="mb-2"><strong>Email:</strong> {paciente.email}</div>
    </div>
  );
};

export default PacienteDetalhe;

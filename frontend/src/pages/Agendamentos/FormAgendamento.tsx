import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createAgendamento, getAgendamento, updateAgendamento } from "../../services/agendamentos";
import { getPacientes } from "../../services/pacientes";
import type { Paciente } from "../../types";

export default function FormAgendamento() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [form, setForm] = useState({
    paciente_id: "",
    data: "",
    procedimento: "",
  });

  useEffect(() => {
    getPacientes().then(res => setPacientes(res.data));
    if (id) {
      getAgendamento(id).then(res => {
        const ag = res.data;
        setForm({
          paciente_id: String(ag.paciente_id),
          data: ag.data,
          procedimento: ag.procedimento || "",
        });
      });
    }
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (id) {
      await updateAgendamento(Number(id), form);
    } else {
      await createAgendamento(form);
    }
    navigate("/agendamentos");
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{id ? "Editar" : "Novo"} Agendamento</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="block">Paciente:</label>
          <select
            name="paciente_id"
            value={form.paciente_id}
            onChange={handleChange}
            required
            className="w-full border px-3 py-1 rounded"
          >
            <option value="">Selecione o paciente</option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block">Data e Hora:</label>
          <input
            type="datetime-local"
            name="data"
            value={form.data}
            onChange={handleChange}
            required
            className="w-full border px-3 py-1 rounded"
          />
        </div>
        <div>
          <label className="block">Procedimento:</label>
          <input
            type="text"
            name="procedimento"
            value={form.procedimento}
            onChange={handleChange}
            required
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

import { useEffect, useState } from "react";
import { getAgendamentos, createAgendamento, deleteAgendamento } from "../../services/agendamentos";
import { getPacientes } from "../../services/pacientes";

type Agendamento = {
  id: number;
  paciente_id: number;
  data: string;
  procedimento: string;
  observacao: string;
  paciente_nome: string;
};

type Paciente = {
  id: number;
  nome: string;
};

export default function ListAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    paciente_id: "",
    data: "",
    procedimento: "",
    observacao: ""
  });

  const fetchAll = () => {
    setLoading(true);
    Promise.all([getAgendamentos(), getPacientes()])
      .then(([ags, pacs]) => {
        setAgendamentos(ags.data);
        setPacientes(pacs.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este agendamento?")) return;
    await deleteAgendamento(id);
    fetchAll();
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createAgendamento({
        paciente_id: Number(form.paciente_id),
        data: form.data,
        procedimento: form.procedimento,
        observacao: form.observacao
      });
      setForm({ paciente_id: "", data: "", procedimento: "", observacao: "" });
      setShowForm(false);
      fetchAll();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Agendamentos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          {showForm ? "Cancelar" : "Novo Agendamento"}
        </button>
      </div>

      {showForm && (
        <form
          className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
          onSubmit={handleSubmit}
        >
          <select
            className="border rounded px-2 py-1"
            name="paciente_id"
            value={form.paciente_id}
            onChange={handleInput}
            required
          >
            <option value="">Selecione o paciente</option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
          <input
            className="border rounded px-2 py-1"
            name="data"
            type="datetime-local"
            value={form.data}
            onChange={handleInput}
            required
          />
          <input
            className="border rounded px-2 py-1"
            name="procedimento"
            placeholder="Procedimento"
            value={form.procedimento}
            onChange={handleInput}
            required
          />
          <textarea
            className="border rounded px-2 py-1"
            name="observacao"
            placeholder="Observações"
            value={form.observacao}
            onChange={handleInput}
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded col-span-1 md:col-span-5 hover:bg-green-600 transition disabled:opacity-60"
            type="submit"
            disabled={saving}
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </form>
      )}

      {loading ? (
        <div>Carregando...</div>
      ) : (
        <table className="min-w-full bg-white shadow rounded-xl">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">Paciente</th>
              <th className="py-2 px-4 text-left">Data</th>
              <th className="py-2 px-4 text-left">Procedimento</th>
              <th className="py-2 px-4 text-left">Observação</th>
              <th className="py-2 px-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="py-2 px-4">{a.paciente_nome}</td>
                <td className="py-2 px-4">{new Date(a.data).toLocaleString("pt-BR")}</td>
                <td className="py-2 px-4">{a.procedimento}</td>
                <td className="py-2 px-4">{a.observacao}</td>
                <td className="py-2 px-4">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(a.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {agendamentos.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-8">
                  Nenhum agendamento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

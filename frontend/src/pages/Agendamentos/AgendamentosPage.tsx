import { useEffect, useState } from "react";
import { getAgendamentos, createAgendamento, updateAgendamento, deleteAgendamento } from "../../services/agendamentos";
import { getPacientes } from "../../services/pacientes";
import type { Agendamento, Paciente } from "../../types";
import { useNavigate } from "react-router-dom";

export default function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busca, setBusca] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    paciente_id: "",
    data: "",
    procedimento: "",
    observacao: "",
  });
  const navigate = useNavigate();

  function fetchAll() {
    Promise.all([getAgendamentos(), getPacientes()]).then(([ags, pacs]) => {
      setAgendamentos(ags.data);
      setPacientes(pacs.data);
    });
  }

  useEffect(() => {
    fetchAll();
  }, []);

  function handleDelete(id: number) {
    if (window.confirm("Deseja realmente excluir este agendamento?")) {
      deleteAgendamento(id).then(fetchAll);
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function resetForm() {
    setForm({ paciente_id: "", data: "", procedimento: "", observacao: "" });
    setEditId(null);
    setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await updateAgendamento(editId, {
          paciente_id: Number(form.paciente_id),
          data: form.data,
          procedimento: form.procedimento,
          observacao: form.observacao,
        });
      } else {
        await createAgendamento({
          paciente_id: Number(form.paciente_id),
          data: form.data,
          procedimento: form.procedimento,
          observacao: form.observacao,
        });
      }
      resetForm();
      fetchAll();
    } finally {
      setSaving(false);
    }
  }

  // Filtro de busca (ID só igual, outros contém)
  const agsFiltrados = agendamentos.filter(a => {
    const buscaTrim = busca.trim();
    if (/^\d+$/.test(buscaTrim)) return String(a.id) === buscaTrim;
    const buscaLower = buscaTrim.toLowerCase();
    return [
      a.paciente_nome,
      a.procedimento,
      a.data,
      a.observacao,
    ]
      .map(val => (val ?? "").toLowerCase())
      .some(v => v.includes(buscaLower));
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Agendamentos</h1>
      <div className="mb-3 flex flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Pesquisar por ID, paciente, procedimento, data..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="border px-3 py-1 rounded w-full max-w-md"
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={() => { setShowForm(true); setEditId(null); setForm({ paciente_id: "", data: "", procedimento: "", observacao: "" }); }}
        >
          Novo Agendamento
        </button>
      </div>

      {showForm && (
        <form className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end" onSubmit={handleSubmit}>
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
          <div className="flex gap-2">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              type="submit"
              disabled={saving}
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
            <button type="button" className="bg-gray-300 text-black px-4 py-2 rounded" onClick={resetForm}>Cancelar</button>
          </div>
        </form>
      )}

      <table className="min-w-full bg-white shadow rounded-xl">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left">ID</th>
            <th className="py-2 px-4 text-left">Paciente</th>
            <th className="py-2 px-4 text-left">Data</th>
            <th className="py-2 px-4 text-left">Procedimento</th>
            <th className="py-2 px-4 text-left">Observação</th>
            <th className="py-2 px-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {agsFiltrados.map((a) => (
            <tr key={a.id} className="border-t">
              <td className="py-2 px-4">{a.id}</td>
              <td className="py-2 px-4">{a.paciente_nome}</td>
              <td className="py-2 px-4">{a.data ? new Date(a.data).toLocaleString("pt-BR") : ""}</td>
              <td className="py-2 px-4">{a.procedimento}</td>
              <td className="py-2 px-4">{a.observacao}</td>
              <td className="py-2 px-4 flex gap-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => navigate(`/agendamentos/${a.id}/detalhes`)}
                >
                  Detalhes
                </button>
                <button
                  className="bg-orange-500 text-white px-2 py-1 rounded"
                  onClick={() => {
                    setEditId(a.id);
                    setForm({
                      paciente_id: String(a.paciente_id),
                      data: a.data?.slice(0, 16) || "",
                      procedimento: a.procedimento,
                      observacao: a.observacao,
                    });
                    setShowForm(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(a.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
          {agsFiltrados.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center text-gray-400 py-8">
                Nenhum agendamento encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

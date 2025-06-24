import { useEffect, useState } from "react";
import { getPacientes, deletePaciente, createPaciente } from "../../services/pacientes";
import { useNavigate } from "react-router-dom";

type Paciente = {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  cpf: string;
};

export default function ListPacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Paciente, "id">>({
    nome: "",
    endereco: "",
    telefone: "",
    email: "",
    cpf: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchPacientes = () => {
    setLoading(true);
    getPacientes()
      .then((res) => setPacientes(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir?")) return;
    await deletePaciente(id);
    fetchPacientes();
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createPaciente(form);
      setForm({ nome: "", endereco: "", telefone: "", email: "", cpf: "" });
      setShowForm(false);
      fetchPacientes();
    } finally {
      setSaving(false);
    }
  };
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Pacientes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          {showForm ? "Cancelar" : "Novo Paciente"}
        </button>
      </div>

      {showForm && (
        <form
          className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
          onSubmit={handleSubmit}
        >
          <input
            className="border rounded px-2 py-1"
            name="nome"
            placeholder="Nome"
            value={form.nome}
            onChange={handleInput}
            required
          />
          <input
            className="border rounded px-2 py-1"
            name="endereco"
            placeholder="Endereço"
            value={form.endereco}
            onChange={handleInput}
            required
          />
          <input
            className="border rounded px-2 py-1"
            name="telefone"
            placeholder="Telefone"
            value={form.telefone}
            onChange={handleInput}
            required
          />
          <input
            className="border rounded px-2 py-1"
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleInput}
            required
          />
          <input
            className="border rounded px-2 py-1"
            name="cpf"
            placeholder="CPF"
            value={form.cpf}
            onChange={handleInput}
            required
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
              <th className="py-2 px-4 text-left">Nome</th>
              <th className="py-2 px-4 text-left">Endereço</th>
              <th className="py-2 px-4 text-left">Telefone</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">CPF</th>
              <th className="py-2 px-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="py-2 px-4">{p.nome}</td>
                <td className="py-2 px-4">{p.endereco}</td>
                <td className="py-2 px-4">{p.telefone}</td>
                <td className="py-2 px-4">{p.email}</td>
                <td className="py-2 px-4">{p.cpf}</td>
                <td className="py-2 px-4">
                  {/* Depois boto editar */}
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(p.id)}
                  >
                    Excluir
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-800 text-white px-3 py-1 rounded ml-2"
                    onClick={() => navigate(`/pacientes/${p.id}`)}
                  >
                    Ver Detalhes
                  </button>
                  
                </td>
              </tr>
            ))}
            {pacientes.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-8">
                  Nenhum paciente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

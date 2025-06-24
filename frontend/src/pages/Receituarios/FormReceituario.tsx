import { useState, useEffect } from "react";
import { addReceituario } from "../../services/receituarios";
import { getPacientes } from "../../services/pacientes";

type Paciente = {
  id: number;
  nome: string;
};

export default function FormReceituario({ onSuccess }: { onSuccess: () => void }) {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [paciente_id, setPacienteId] = useState<number>();
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPacientes().then(res => setPacientes(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paciente_id) return alert("Selecione o paciente");
    setLoading(true);
    await addReceituario({ paciente_id, texto });
    setTexto("");
    setLoading(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-4 max-w-md">
      <select
        className="border rounded p-2"
        value={paciente_id || ""}
        onChange={(e) => setPacienteId(Number(e.target.value))}
        required
      >
        <option value="">Selecione o paciente</option>
        {pacientes.map((p) => (
          <option value={p.id} key={p.id}>
            {p.nome}
          </option>
        ))}
      </select>
      <textarea
        className="border rounded p-2"
        placeholder="Texto do receituário"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        required
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        Salvar
      </button>
    </form>
  );
}

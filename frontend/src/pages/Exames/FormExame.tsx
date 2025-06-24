import { useEffect, useState, useRef } from "react";
import { getPacientes } from "../../services/pacientes";
import { uploadExame } from "../../services/exames";

type Paciente = {
  id: number;
  nome: string;
};

type Props = {
  onSuccess?: () => void;
};

export default function FormExame({ onSuccess }: Props) {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteId, setPacienteId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getPacientes().then(res => setPacientes(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteId || !file) {
      alert("Selecione um paciente e um arquivo!");
      return;
    }
    await uploadExame({ paciente_id: pacienteId, descricao, file });
    setPacienteId("");
    setDescricao("");
    setFile(null);
    if (fileInput.current) fileInput.current.value = "";
    if (onSuccess) onSuccess();
  };

  return (
    <form className="mb-6" onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-4">Novo Exame</h2>
      <div className="flex gap-4 flex-wrap">
        <select
          className="border rounded px-3 py-2"
          value={pacienteId}
          onChange={e => setPacienteId(e.target.value)}
          required
        >
          <option value="">Selecione o paciente</option>
          {pacientes.map(p => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>
        <input
          type="text"
          className="border rounded px-3 py-2"
          placeholder="Descrição (opcional)"
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
        />
        <input
          type="file"
          className="border rounded px-3 py-2"
          ref={fileInput}
          onChange={e => setFile(e.target.files?.[0] ?? null)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-800 text-white px-6 py-2 rounded"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}

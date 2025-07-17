import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAgendamento, createAgendamento, updateAgendamento } from "../../services/agendamentos";
import { getPacientes } from "../../services/pacientes";
import { getProdutosServicos } from "../../services/produtosservicos";
import type { Agendamento, Paciente, ProdutoServico } from "../../types";

const mascaraValor = (value: string) => {
  value = value.replace(/\D/g, "");
  value = (parseInt(value, 10) / 100).toFixed(2) + "";
  value = value.replace(".", ",");
  return value.replace(/(\d)(?=(\d{3})+,)/g, "$1.");
};

const FormAgendamento: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [produtos, setProdutos] = useState<ProdutoServico[]>([]);
  const [agendamento, setAgendamento] = useState<Partial<Agendamento>>({
    paciente_id: "",
    data: "",
    procedimento: "",
    valor: "",
    observacao: "",
  });
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    getPacientes().then((res) => setPacientes(res.data));
    getProdutosServicos().then((res) => setProdutos(res.data));
    if (id) {
      setCarregando(true);
      getAgendamento(Number(id))
        .then((res) => setAgendamento(res.data))
        .finally(() => setCarregando(false));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "procedimento") {
      // Busca o produto selecionado e preenche o valor automaticamente
      const produto = produtos.find((p) => String(p.id) === value);
      setAgendamento({
        ...agendamento,
        procedimento: produto ? produto.nome : "",
        valor: produto ? mascaraValor(produto.valor?.toString() ?? "0") : "",
      });
    } else if (name === "valor") {
      setAgendamento({ ...agendamento, [name]: mascaraValor(value) });
    } else {
      setAgendamento({ ...agendamento, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    try {
      if (id) {
        await updateAgendamento(Number(id), agendamento);
      } else {
        await createAgendamento(agendamento);
      }
      navigate("/agendamentos");
    } catch (error) {
      alert("Erro ao salvar agendamento!");
    } finally {
      setCarregando(false);
    }
  };

  const handleCancelar = () => navigate("/agendamentos");

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">{id ? "Editar Agendamento" : "Novo Agendamento"}</h2>
      {carregando ? (
        <div>Carregando...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Paciente</label>
            <select
              name="paciente_id"
              value={agendamento.paciente_id || ""}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
            >
              <option value="">Selecione</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Data</label>
            <input
              type="datetime-local"
              name="data"
              value={agendamento.data?.slice(0, 16) || ""}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Procedimento</label>
            <select
              name="procedimento"
              value={produtos.find(p => p.nome === agendamento.procedimento)?.id || ""}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
            >
              <option value="">Selecione</option>
              {produtos.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.nome} {prod.valor ? `- R$ ${prod.valor.toString().replace(".", ",")}` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Valor (R$)</label>
            <input
              type="text"
              name="valor"
              value={agendamento.valor || ""}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
              inputMode="numeric"
              pattern="\d{1,3}(\.\d{3})*,\d{2}"
              title="Formato: 0,00"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Observação</label>
            <input
              type="text"
              name="observacao"
              value={agendamento.observacao || ""}
              onChange={handleChange}
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

export default FormAgendamento;

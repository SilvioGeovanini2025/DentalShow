// src/pages/Pacientes/PacienteDetalhe.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPaciente } from "../../services/pacientes";
import { getAgendamentos } from "../../services/agendamentos";
import { getReceituarios } from "../../services/receituarios";
import { getProntuarios } from "../../services/prontuarios";
import { getExames } from "../../services/exames";
import { getPagamentos } from "../../services/pagamentos";

// Função utilitária para previnir quebra com substring
function preview(text?: string, n = 40) {
  if (!text) return "";
  return text.length > n ? text.substring(0, n) + "..." : text;
}

export default function PacienteDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState<any>(null);
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [receituarios, setReceituarios] = useState<any[]>([]);
  const [prontuarios, setProntuarios] = useState<any[]>([]);
  const [exames, setExames] = useState<any[]>([]);
  const [pagamentos, setPagamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    Promise.all([
      getPaciente(id),
      getAgendamentos(),
      getReceituarios(),
      getProntuarios(),
      getExames(),
      getPagamentos(),
    ]).then(
      ([
        pacienteRes,
        agRes,
        recRes,
        proRes,
        exRes,
        pagRes,
      ]) => {
        setPaciente(pacienteRes.data);
        setAgendamentos(agRes.data.filter((a: any) => String(a.paciente_id) === id));
        setReceituarios(recRes.data.filter((r: any) => String(r.paciente_id) === id));
        setProntuarios(proRes.data.filter((p: any) => String(p.paciente_id) === id));
        setExames(exRes.data.filter((e: any) => String(e.paciente_id) === id));
        setPagamentos(pagRes.data.filter((p: any) => String(p.paciente_id) === id));
      }
    ).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Carregando...</div>;
  if (!paciente) return <div>Paciente não encontrado.</div>;

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
      >
        ← Voltar
      </button>
      <h2 className="text-2xl font-bold mb-2">Paciente: {paciente.nome}</h2>
      <div className="mb-4">
        <span className="mr-6">CPF: {paciente.cpf}</span>
        <span className="mr-6">Telefone: {paciente.telefone}</span>
        <span className="mr-6">Email: {paciente.email}</span>
        <span>Endereço: {paciente.endereco}</span>
      </div>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Agendamentos</h3>
        {agendamentos.length === 0 ? <div className="text-gray-400">Nenhum agendamento</div> :
          <ul className="list-disc pl-5">{agendamentos.map((a, i) =>
            <li key={i}>{a.data} - {a.procedimento || ""} ({a.status || ""})</li>
          )}</ul>
        }
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Receituários</h3>
        {receituarios.length === 0 ? <div className="text-gray-400">Nenhum receituário</div> :
          <ul className="list-disc pl-5">{receituarios.map((r, i) =>
            <li key={i}>{r.data} - {preview(r.conteudo)}</li>
          )}</ul>
        }
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Prontuários</h3>
        {prontuarios.length === 0 ? <div className="text-gray-400">Nenhum prontuário</div> :
          <ul className="list-disc pl-5">{prontuarios.map((p, i) =>
            <li key={i}>{p.data} - {preview(p.anotacao)}</li>
          )}</ul>
        }
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Exames</h3>
        {exames.length === 0 ? <div className="text-gray-400">Nenhum exame</div> :
          <ul className="list-disc pl-5">{exames.map((e, i) =>
            <li key={i}>
              {e.data} - <a href={e.arquivo_url} className="underline text-blue-600" target="_blank" rel="noopener noreferrer">{e.nome_arquivo || ""}</a>
            </li>
          )}</ul>
        }
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Pagamentos</h3>
        {pagamentos.length === 0 ? <div className="text-gray-400">Nenhum pagamento</div> :
          <ul className="list-disc pl-5">{pagamentos.map((p, i) =>
            <li key={i}>{p.data} - R$ {Number(p.valor).toFixed(2)} ({p.forma_pagamento || ""})</li>
          )}</ul>
        }
      </section>
    </div>
  );
}
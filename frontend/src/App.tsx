import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/sidebar";

import PacientesPage from "./pages/Pacientes/PacientesPage";
import FormPaciente from "./pages/Pacientes/FormPaciente";
import PacienteDetalhe from "./pages/Pacientes/PacienteDetalhe";

import AgendamentosPage from "./pages/Agendamentos/AgendamentosPage";
import FormAgendamento from "./pages/Agendamentos/FormAgendamento";
import AgendamentoDetalhe from "./pages/Agendamentos/AgendamentoDetalhe";

import ProdutosServicosPage from "./pages/ProdutosServicos/ProdutosServicosPage";
import FormProdutoServico from "./pages/ProdutosServicos/FormProdutoServico";
import ProdutoServicoDetalhe from "./pages/ProdutosServicos/ProdutoServicoDetalhe";

import PagamentosPage from "./pages/Pagamentos/PagamentosPage";
import FormPagamento from "./pages/Pagamentos/FormPagamento";
import PagamentoDetalhe from "./pages/Pagamentos/PagamentoDetalhe";

import LoginPage from "./pages/LoginPage";

const App: React.FC = () => {
  const token = localStorage.getItem("token");

  return (
    <Router>
      {token ? (
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <main className="flex-1 p-6 overflow-auto">
            <Routes>
              {/* Módulo Pacientes */}
              <Route path="/pacientes" element={<PacientesPage />} />
              <Route path="/pacientes/novo" element={<FormPaciente />} />
              <Route path="/pacientes/:id/detalhes" element={<PacienteDetalhe />} />
              <Route path="/pacientes/:id" element={<FormPaciente />} />

              {/* Módulo Agendamentos */}
              <Route path="/agendamentos" element={<AgendamentosPage />} />
              <Route path="/agendamentos/novo" element={<FormAgendamento />} />
              <Route path="/agendamentos/:id/detalhes" element={<AgendamentoDetalhe />} />
              <Route path="/agendamentos/:id" element={<FormAgendamento />} />

              {/* Módulo Produtos/Serviços */}
              <Route path="/produtosservicos" element={<ProdutosServicosPage />} />
              <Route path="/produtosservicos/novo" element={<FormProdutoServico />} />
              <Route path="/produtosservicos/:id/detalhes" element={<ProdutoServicoDetalhe />} />
              <Route path="/produtosservicos/:id" element={<FormProdutoServico />} />

              {/* Módulo Pagamentos */}
              <Route path="/pagamentos" element={<PagamentosPage />} />
              <Route path="/pagamentos/novo" element={<FormPagamento />} />
              <Route path="/pagamentos/:id/detalhes" element={<PagamentoDetalhe />} />
              <Route path="/pagamentos/:id" element={<FormPagamento />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/pacientes" />} />
            </Routes>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;

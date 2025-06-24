// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Header from "./components/Header";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Pacientes
import PacientesPage from "./pages/Pacientes/PacientesPage";
import FormPaciente from "./pages/Pacientes/FormPaciente";
import PacienteDetalhe from "./pages/Pacientes/PacienteDetalhe";

// Agendamentos
import AgendamentosPage from "./pages/Agendamentos/AgendamentosPage";
import FormAgendamento from "./pages/Agendamentos/FormAgendamento";
import AgendamentoDetalhe from "./pages/Agendamentos/AgendamentoDetalhe";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 overflow-y-auto p-4">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Pacientes */}
              <Route
                path="/pacientes"
                element={
                  <ProtectedRoute>
                    <PacientesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pacientes/novo"
                element={
                  <ProtectedRoute>
                    <FormPaciente />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pacientes/:id"
                element={
                  <ProtectedRoute>
                    <FormPaciente />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pacientes/:id/detalhes"
                element={
                  <ProtectedRoute>
                    <PacienteDetalhe />
                  </ProtectedRoute>
                }
              />

              {/* Agendamentos */}
              <Route
                path="/agendamentos"
                element={
                  <ProtectedRoute>
                    <AgendamentosPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agendamentos/novo"
                element={
                  <ProtectedRoute>
                    <FormAgendamento />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agendamentos/:id"
                element={
                  <ProtectedRoute>
                    <FormAgendamento />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agendamentos/:id/detalhes"
                element={
                  <ProtectedRoute>
                    <AgendamentoDetalhe />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}
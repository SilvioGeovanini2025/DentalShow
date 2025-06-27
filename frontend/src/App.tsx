import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import PacientesPage from "./pages/Pacientes/PacientesPage";
import AgendamentosPage from "./pages/Agendamentos/AgendamentosPage";
import PagamentosPage from "./pages/Pagamentos/PagamentosPage";
import ProdutosServicosPage from "./pages/Servicos/ProdutosServicosPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import ProtectedRoute from "./ProtectedRoute";
import PrivateLayout from "./components/PrivateLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PrivateLayout />
            </ProtectedRoute>
          }
        >
          <Route path="pacientes" element={<PacientesPage />} />
          <Route path="agendamentos" element={<AgendamentosPage />} />
          <Route path="pagamentos" element={<PagamentosPage />} />
          <Route path="produtosservicos" element={<ProdutosServicosPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

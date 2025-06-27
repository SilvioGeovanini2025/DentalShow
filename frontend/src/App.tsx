// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import PacientesPage from "./pages/Pacientes/PacientesPage";
import AgendamentosPage from "./pages/Agendamentos/AgendamentosPage";
import PagamentosPage from "./pages/Pagamentos/PagamentosPage";
import ProdutosServicosPage from "./pages/Servicos/ProdutosServicosPage";

import Sidebar from "./components/sidebar";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      {token && <Sidebar />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {token && (
          <>
            <Route path="/pacientes" element={<PacientesPage />} />
            <Route path="/agendamentos" element={<AgendamentosPage />} />
            <Route path="/pagamentos" element={<PagamentosPage />} />
            <Route path="/produtosservicos" element={<ProdutosServicosPage />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

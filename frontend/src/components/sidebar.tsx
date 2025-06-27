// src/components/sidebar.tsx
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaCalendarAlt,
  FaPrescriptionBottle,
  FaFileMedical,
  FaFlask,
  FaMoneyBillAlt,
  FaBoxOpen,
  FaWhatsapp,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-1/6 h-screen bg-blue-900 text-white flex flex-col">
      <div className="text-2xl font-bold p-4 border-b border-blue-700">
        DentalShow
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link to="/pacientes" className="flex items-center space-x-2 hover:text-blue-300">
          <FaUser />
          <span>Pacientes</span>
        </Link>
        <Link to="/agendamentos" className="flex items-center space-x-2 hover:text-blue-300">
          <FaCalendarAlt />
          <span>Agendamentos</span>
        </Link>
        <Link to="/receituarios" className="flex items-center space-x-2 hover:text-blue-300">
          <FaPrescriptionBottle />
          <span>Receituários</span>
        </Link>
        <Link to="/prontuarios" className="flex items-center space-x-2 hover:text-blue-300">
          <FaFileMedical />
          <span>Prontuários</span>
        </Link>
        <Link to="/exames" className="flex items-center space-x-2 hover:text-blue-300">
          <FaFlask />
          <span>Exames</span>
        </Link>
        <Link to="/pagamentos" className="flex items-center space-x-2 hover:text-blue-300">
          <FaMoneyBillAlt />
          <span>Pagamentos</span>
        </Link>
        <Link to="/produtosservicos" className="flex items-center space-x-2 hover:text-blue-300">
          <FaBoxOpen />
          <span>Produtos/Serviços</span>
        </Link>
        <Link to="https://wa.me/seunumero" target="_blank" className="flex items-center space-x-2 hover:text-blue-300">
          <FaWhatsapp />
          <span>WhatsApp</span>
        </Link>
      </nav>
      <button onClick={handleLogout} className="p-4 flex items-center space-x-2 hover:text-red-500">
        <FaSignOutAlt />
        <span>Sair</span>
      </button>
    </div>
  );
};

export default Sidebar;

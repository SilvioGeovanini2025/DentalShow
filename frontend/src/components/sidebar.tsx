import React from "react";
import { NavLink } from "react-router-dom";
import { 
  FaUser, FaCalendarAlt, FaFilePrescription, 
  FaNotesMedical, FaVial, FaBoxOpen, FaDollarSign, FaSignOutAlt 
} from "react-icons/fa";

// Animação de balanço no SVG
const DenteAnimado = () => (
  <svg
    width="38"
    height="38"
    viewBox="0 0 64 64"
    fill="none"
    className="mb-1 animate-[wiggle_2s_ease-in-out_infinite]"
    style={{ display: "block" }}
  >
    <g>
      {/* Contorno preto */}
      <path
        d="M32 6C18 6 7 18 12 41c2 9 4 15 8 15 5 0 5-7 6-14 1-7 5-7 6 0 1 7 1 14 6 14 4 0 6-6 8-15C57 18 46 6 32 6Z"
        fill="#fff"
        stroke="#111"
        strokeWidth="2"
      />
      {/* “Bochecha” rosa esquerda */}
      <ellipse cx="22" cy="37" rx="2.5" ry="1.2" fill="#FBCFE8" />
      {/* “Bochecha” rosa direita */}
      <ellipse cx="42" cy="37" rx="2.5" ry="1.2" fill="#FBCFE8" />
      {/* Olho esquerdo */}
      <ellipse cx="25" cy="32" rx="1.3" ry="1.4" fill="#111" />
      {/* Olho direito */}
      <ellipse cx="39" cy="32" rx="1.3" ry="1.4" fill="#111" />
      {/* Sorriso */}
      <path
        d="M28 38 Q32 40 36 38"
        stroke="#111"
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
      />
      {/* Sombra suave */}
      <ellipse cx="32" cy="58" rx="8" ry="2" fill="#94A3B8" fillOpacity={0.2} />
    </g>
    <style>
      {`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg);}
          10% { transform: rotate(-8deg);}
          20% { transform: rotate(7deg);}
          30% { transform: rotate(-6deg);}
          40% { transform: rotate(5deg);}
          50% { transform: rotate(-4deg);}
          60% { transform: rotate(3deg);}
          70% { transform: rotate(-2deg);}
          80% { transform: rotate(1deg);}
          90% { transform: rotate(0deg);}
        }
      `}
    </style>
  </svg>
);

const Sidebar: React.FC = () => {
  const menu = [
    { path: "/pacientes", label: "Pacientes", icon: <FaUser /> },
    { path: "/agendamentos", label: "Agendamentos", icon: <FaCalendarAlt /> },
    { path: "/receituarios", label: "Receituários", icon: <FaFilePrescription /> },
    { path: "/prontuarios", label: "Prontuários", icon: <FaNotesMedical /> },
    { path: "/exames", label: "Exames", icon: <FaVial /> },
    { path: "/produtosservicos", label: "Produtos/Serviços", icon: <FaBoxOpen /> },
    { path: "/pagamentos", label: "Pagamentos", icon: <FaDollarSign /> }, // ADICIONADO AQUI!
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <aside className="flex flex-col h-screen w-56 bg-blue-700 shadow">
      <div className="p-6 pb-1 flex flex-col items-center">
        <div className="flex flex-col items-center">
          {/* Dente animado */}
          <DenteAnimado />
          <span className="text-2xl font-bold text-white">Dental Show</span>
        </div>
        <span className="text-xs font-normal text-white mt-2 text-center">
          Gestão clínica
        </span>
      </div>
      <nav className="flex-1">
        <ul className="mt-4">
          {menu.map((item) => (
            <li key={item.path} className="mb-1">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-5 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-blue-900 text-white font-semibold"
                      : "text-white hover:bg-blue-800"
                  }`
                }
                end
              >
                <span className="text-lg mr-3">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto p-4">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 rounded-lg text-white bg-blue-900 hover:bg-blue-800 transition"
        >
          <FaSignOutAlt className="mr-3 text-red-300" />
          <span className="text-white">Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

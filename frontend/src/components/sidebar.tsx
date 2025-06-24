import { NavLink } from "react-router-dom";

const links = [
  { to: "/pacientes", label: "Pacientes" },
  { to: "/agendamentos", label: "Agendamentos" },
  { to: "/receituarios", label: "Receituários" },
  { to: "/prontuarios", label: "Prontuários" },
  { to: "/exames", label: "Exames" },
  { to: "/pagamentos", label: "Pagamentos" },
  { to: "/servicos", label: "Produtos/Serviços" },
  { to: "/whatsapp", label: "WhatsApp" },
];

export default function Sidebar() {
  return (
    <aside className="bg-blue-900 text-white w-52 h-full flex flex-col px-4 py-8">
      <div className="font-bold text-2xl mb-8 text-center tracking-wider">
        DentalShow
      </div>
      <nav className="flex flex-col gap-3">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `py-2 px-3 rounded-xl transition ${isActive ? "bg-white text-blue-900 font-semibold" : "hover:bg-blue-800"}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

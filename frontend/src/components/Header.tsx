import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <header className="h-16 bg-blue-100 flex items-center px-6 shadow">
      <h1 className="text-xl font-bold">DentalShow - Gestão Clínica</h1>
      <div className="ml-auto font-medium text-blue-900 flex items-center gap-4">
        {isLoggedIn && (
          <>
            Bem-vindo!
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Sair
            </button>
          </>
        )}
      </div>
    </header>
  );
}
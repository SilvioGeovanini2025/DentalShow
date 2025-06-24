import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/auth"; // <-- Importa corretamente!

export default function RegisterPage() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    try {
      await register({ username: usuario, password: senha });
 // <- Mapeia certo!
      navigate("/login");
    } catch {
      setErro("Falha ao cadastrar. Usuário já existe ou erro do servidor.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow flex flex-col gap-4 w-full max-w-xs">
        <h2 className="font-bold text-2xl text-blue-900 text-center mb-4">Cadastro</h2>
        <input
          type="text"
          placeholder="Usuário"
          value={usuario}
          onChange={e => setUsuario(e.target.value)}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          className="border px-3 py-2 rounded"
          required
        />
        {erro && <div className="text-red-500 text-sm">{erro}</div>}
        <button className="bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded py-2">Cadastrar</button>
        <div className="text-sm text-center mt-2">
          <span>Já tem conta? </span>
          <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </div>
      </form>
    </div>
  );
}
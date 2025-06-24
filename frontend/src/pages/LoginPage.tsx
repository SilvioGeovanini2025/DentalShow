import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/auth";

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    try {
      const { data } = await login({ username: usuario, password: senha });
      localStorage.setItem("token", data.token);
      navigate("/pacientes");  // redireciona pro módulo de Pacientes direto
    } catch {
      setErro("Usuário ou senha inválidos.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow flex flex-col gap-4 w-full max-w-xs">
        <h2 className="font-bold text-2xl text-blue-900 text-center mb-4">Login</h2>
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
        <button className="bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded py-2">Entrar</button>
        <div className="text-sm text-center mt-2">
          <span>Não tem conta? </span>
          <Link to="/register" className="text-blue-600 hover:underline">Cadastre-se</Link>
        </div>
      </form>
    </div>
  );
}

// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // ajuste se necessário
});

// Intercepta e adiciona o token a cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

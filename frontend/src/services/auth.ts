// src/services/auth.ts
import api from "./api";

export function login(data: { username: string; password: string }) {
  return api.post("/auth/login", data);
}

export function register(data: { username: string; password: string }) {
  return api.post("/auth/register", data);
}

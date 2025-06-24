import api from "./api";
import type { Agendamento } from "../types";

export function getAgendamentos() {
  return api.get<Agendamento[]>("/agendamentos");
}
export function getAgendamento(id: string | number) {
  return api.get<Agendamento>(`/agendamentos/${id}`);
}
export function createAgendamento(data: any) {
  return api.post("/agendamentos", data);
}
export function updateAgendamento(id: number, data: any) {
  return api.put(`/agendamentos/${id}`, data);
}
export function deleteAgendamento(id: number) {
  return api.delete(`/agendamentos/${id}`);
}

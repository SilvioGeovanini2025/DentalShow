import api from "./api";

export const getPacientes = () => api.get("/pacientes");
export const getPaciente = (id: number | string) => api.get(`/pacientes/${id}`); // ADICIONE ESTA LINHA!
export const createPaciente = (data: any) => api.post("/pacientes", data);
export const updatePaciente = (id: number, data: any) => api.put(`/pacientes/${id}`, data);
export const deletePaciente = (id: number) => api.delete(`/pacientes/${id}`);


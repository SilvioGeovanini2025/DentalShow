export interface Paciente {
  id: number;
  nome: string;
}

export interface Agendamento {
  id: number;
  paciente_id: number;
  paciente_nome: string;
  data: string;
  procedimento: string;
  observacao: string;
}

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

export interface Produto {
  id: number;
  nome: string;
  valor: number;
  ativo: boolean;
}

// src/types.ts

export interface Servico {
  id: number;
  nome: string;
  valor: number;
  ativo: boolean;
}

// src/types.ts


export interface Paciente {
  id: number;
  nome: string;
  endereco?: string;
  telefone?: string;
  email: string;
  cpf: string;
}

// Agendamento
export interface Agendamento {
  id: number;
  paciente_id: number | string;
  paciente_nome?: string;
  data: string;
  procedimento: string;      // Adicionado para agendamento (select no form)
  valor: string;             // Adicionado (campo valor com máscara)
  observacao?: string;
}

export interface Receituario {
  id: number;
  paciente_id: number;
  texto: string;
  data: string;
  // paciente?: Paciente; // só inclua se for retornar o objeto paciente junto (atualmente NÃO retorna)
}

// Prontuário
export interface Prontuario {
  id: number;
  paciente_id: number;
  paciente?: Paciente;
  anotacao: string;
  data?: string;
}

// Exame
export interface Exame {
  id: number;
  paciente_id: number;
  paciente?: Paciente;
  descricao: string;
  caminho_arquivo?: string;
  data?: string;
}

// Produto/Serviço
export interface ProdutoServico {
  id: number;
  nome: string;
  valor: string;         // <- igual backend!
  descricao?: string;    // <- para tela de cadastro e detalhes
}

// Pagamento
export interface Pagamento {
  id: number;
  paciente_id: number;
  valor: number;
  forma_pagamento: string;
  data: string;
  paciente_nome?: string; // <- Campo opcional, exatamente igual ao que vai vir do back!
}

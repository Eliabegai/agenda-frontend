interface IAgendamento {
  id: string;
  protocoloId: string;
  dataHora: string;
  criadoEm: string;
  atualizadoEm: string;
  status: string;
  userId: string;
}

interface IHorario {
  id: string;
  diaSemana: number;
  startTime: string;
  endTime: string;
  breakStart: string;
  breakEnd: string;
  userId: string;
}

interface IIndisponibilidade {
  id: string;
  inicio: string;
  fim: string;
  dataInicio: string;
  dataFim: string;
  motivo: string;
  userId: string;
}

interface IFuncionario {
  id: string;
  role: string;
  nome: string;
  email: string;
  agendamentos: IAgendamento[];
  indisponibilidades: IIndisponibilidade[];
  horarios: IHorario[];
}
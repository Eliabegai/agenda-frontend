interface ICliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  criadoEm: string
}

interface IProtocolo {
  id: string;
  clienteId: string;
  codigo: string;
  cliente: ICliente;
}

interface IUser {
  id: string;
  nome: string;
  email: string;
  role: string;
}

interface IAgendamento {
  id: string;
  dataHora: string;
  status: string;
  userId: string;
  User: IUser;
  protocoloId: string;
  protocolo: IProtocolo;
}

interface IVisualizarAgendaProps {
  agendamentos: IAgendamento[];
}
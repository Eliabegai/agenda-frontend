import { useEffect, useState } from 'react';
import { api } from '../../../api';
import { IAgendamento } from './AgendaGeral'
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faFile, faRotate, faSquarePhoneFlip, faUser } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../ui/button';
import CardAgenda from './CardAgenda';

interface VisualizarAgendaProps {
  agendamentos: IAgendamento[]
}

const VisualizarAgenda = ({agendamentos}: VisualizarAgendaProps) => {

  const [clientes, setClientes] = useState<string[]>([])
  const [protocolo, setProtocolo] = useState<string[]>([])

  const getClienteByProtocol = async (id: string) => {

    const getClientes = []

    try {
      const response = await api.get(`/protocolo?id=${id}`);
      const protocolo = response.data
      setProtocolo(protocolo?.[0].codigo)
      const responseCliente = await api.get(`/clientes?id=${protocolo?.[0].clienteId}`);
      const clienteNome = responseCliente.data  

      getClientes.push(clienteNome?.[0].nome)
    } catch (error) {
      console.error('Erro ao buscar os dados', error);
      toast.error('Erro ao buscar os dados');
    }
    setClientes(getClientes || [])
  }

  useEffect(() => {
    for (let i = 0; i < agendamentos.length ; i++) {
      getClienteByProtocol(agendamentos[i].protocoloId)
    }
  }, [])
  
  console.log(agendamentos)
  console.log(clientes)
  console.log(protocolo)

  return(
    <div>
      <div className='flex flex-col w-full space-y-3 p-2 overflow-auto h-96'>
        {agendamentos?.map((agenda, i) => (
          <CardAgenda key={i} cliente={clientes[i]} dataHora={agenda.dataHora} protocolo={protocolo} />
        ))}
      </div>
    </div>
  )
}

export default VisualizarAgenda
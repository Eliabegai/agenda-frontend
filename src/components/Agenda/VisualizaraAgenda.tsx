import { ScrollArea } from '../ui/scroll-area';
import CardAgenda from './CardAgenda';

interface VisualizarAgendaProps {
  agendamentos: IAgendamento[]
  updateAgendamento: (dataHora:string) => void
}

const VisualizarAgenda = ({agendamentos, updateAgendamento}: VisualizarAgendaProps) => {

  return(
    <div className='flex flex-wrap w-full h-full justify-center items-center gap-4 overflow-auto'>
      {agendamentos?.map((agenda) => (
        <CardAgenda
          key={agenda.id}
          agenda={agenda}
          updateAgendamento={updateAgendamento}
        />
      ))}
    </div>
  )
}

export default VisualizarAgenda
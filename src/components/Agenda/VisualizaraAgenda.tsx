import CardAgenda from './CardAgenda';

interface VisualizarAgendaProps {
  agendamentos: IAgendamento[]
}

const VisualizarAgenda = ({agendamentos}: VisualizarAgendaProps) => {

  console.log('agendamentos componente', agendamentos)

  return(
    <div>
      <div className='flex flex-col w-full space-y-3 p-2 overflow-auto h-96'>
        {agendamentos?.map((agenda) => (
          <CardAgenda
            key={agenda.id}
            agenda={agenda}
          />
        ))}
      </div>
    </div>
  )
}

export default VisualizarAgenda
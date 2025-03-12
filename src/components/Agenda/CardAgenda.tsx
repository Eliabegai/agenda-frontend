import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '../ui/button'
import { faEnvelope, faFile, faRotate, faSquarePhoneFlip, faUser } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { Copy } from 'lucide-react'
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR'


interface CardAgendaProps {
  agenda: any
}

const CardAgenda = ({ agenda }:CardAgendaProps) => {

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [count, setCount] = useState(1)
  const dataFormatada = format(new Date(agenda.dataHora), "dd/MM/yyyy 'às' HH:mm'h' ", { locale: ptBR })

  const handleClick = (id: string) => {
    setIsLoading(!isLoading)

    setTimeout(() => {
      setCount(count + 1)
      setIsLoading(false)
    }, 2000)
  }

  return(
    <div className='flex flex-col gap-4 p-3 bg-zinc-200 dark:bg-zinc-800 rounded-lg shadow-lg'>
      <div className='flex flex-col border-b border-zinc-400 space-y-2'>
        <h2 className='font-normal text-2xl'>{dataFormatada}</h2>
        <span className='text-lg ml-2 text-zinc-700 dark:text-zinc-300'>{agenda.protocolo.cliente.nome}</span>
      </div>
      <div className='flex flex-col justify-center items-start space-y-2'>
        <span className='flex flex-row gap-2 justify-center items-center'><FontAwesomeIcon icon={faSquarePhoneFlip} size='lg' className='rotate-90' /> {agenda.protocolo.cliente.telefone}</span>
        <div className='flex justify-between space-x-2 items-center'>
          <span className='flex flex-row gap-2 justify-center items-center'><FontAwesomeIcon icon={faEnvelope} size='lg' /> {agenda.protocolo.cliente.email}</span>
          <Copy size={'16px'} />
        </div>
        <span className='flex flex-row gap-2 justify-center items-center'><FontAwesomeIcon icon={faFile} size='lg' /> Protocolo: {agenda.protocolo.codigo}</span>
        <span className='block w-full border-b border-zinc-400'></span>
        <div className='flex w-full justify-between'>
          <span className='flex flex-row gap-2 justify-center items-center'><FontAwesomeIcon icon={faUser} size='lg' /> Funcionario: {agenda.User.nome}</span>
          <Button variant={'ghost'} onClick={() => handleClick(agenda.id)} >
            <FontAwesomeIcon icon={faRotate}size='lg' data-loading={isLoading} className='data-[loading=true]:animate-spin' />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CardAgenda
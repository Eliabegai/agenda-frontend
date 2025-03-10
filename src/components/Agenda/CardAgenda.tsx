import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '../ui/button'
import { faEnvelope, faFile, faRotate, faSquarePhoneFlip, faUser } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'


interface CardAgendaProps {
  dataHora: string
  cliente: string
  protocolo: string[]
}

const CardAgenda = ({ dataHora, cliente, protocolo }:CardAgendaProps) => {

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [count, setCount] = useState(1)

  const handleClick = () => {
    setIsLoading(!isLoading)

    setTimeout(() => {
      setCount(count + 1)
      setIsLoading(false)
    }, 2000)
  }

  return(
    <div className='flex flex-col gap-4 p-3 bg-zinc-200 dark:bg-zinc-800 rounded-lg shadow-lg'>
      <div className='flex flex-col border-b border-zinc-400 space-y-2'>
        <h2 className='font-normal text-2xl'>{dataHora}</h2>
        <span className='text-lg ml-2 text-zinc-700 dark:text-zinc-300'>{cliente}</span>
      </div>
      <div className='flex flex-col justify-center items-start space-y-2'>
        <span className='flex flex-row gap-2 justify-center items-center'><FontAwesomeIcon icon={faSquarePhoneFlip} size='lg' className='rotate-90' /> (47) 9 9208-2307</span>
        <span className='flex flex-row gap-2 justify-center items-center'><FontAwesomeIcon icon={faEnvelope} size='lg' /> cliente.teste@email.com</span>
        <span className='flex flex-row gap-2 justify-center items-center'><FontAwesomeIcon icon={faFile} size='lg' /> Protocolo: {protocolo}</span>
        <span className='block w-full border-b border-zinc-400'></span>
        <div className='flex w-full justify-between'>
          <span className='flex flex-row gap-2 justify-center items-center'><FontAwesomeIcon icon={faUser} size='lg' /> Funcionario: Funcionario {count}</span>
          <Button variant={'ghost'} onClick={handleClick} >
            <FontAwesomeIcon icon={faRotate}size='lg' data-loading={isLoading} className='data-[loading=true]:animate-spin' />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CardAgenda
'use client'
import { Ban, Pencil, Trash, User } from 'lucide-react'
import { Button } from '../ui/button'
import Tooltip from '../Toolttip/Tooltip'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

interface CardUserProps {
  funcionario: IFuncionario
  handleEditUser: (id:string) => void
  handleRemoveUser: (id:string) => void
  handleIndisponivelUser: (id:string) => void
}

const CardUser = ({ funcionario, handleEditUser, handleRemoveUser, handleIndisponivelUser }: CardUserProps) => {

  const [indisponibilidade, setIndisponibilidade]= useState<string>('Indisponível')
  const [indisponivel, setIndisponivel] = useState(false)

  const isIndisponivel = () => {
    
    if(funcionario?.indisponibilidades[0]) {
      const indisp = funcionario?.indisponibilidades[0]
      const now = new Date()
      const dataInicio = new Date(indisp?.dataInicio)
      const dataFim = new Date(indisp?.dataFim)
      const dataFinal = new Date(indisp?.dataFim)
      
      const dia= format(dataFinal, 'dd/MM')
      const hora= format(dataFinal, 'HH:mm',)
      
      setIndisponibilidade(`Até ${dia}-${hora}h`)
      return (now >= dataInicio && now <= dataFim)

    } else {
      return false
    }
  }

  useEffect(() => {
    const indisponivel = isIndisponivel()
    setIndisponivel(indisponivel)
  },[funcionario])

  return(
    <div key={funcionario.id} className='flex flex-row w-80 h-32 justify-center items-center space-x-2  p-2'>
      
      <div className='flex w-20 h-20 justify-center items-center border rounded-full shadow-lg dark:shadow-zinc-700'>
        <User size={'36px'} />
      </div>
      
      <div className='flex flex-col justify-center w-full h-full flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2 shadow-lg dark:shadow-zinc-700'>
        <div className='flex flex-col flex-1 w-full'>
          <span>{funcionario.nome}</span>
          <span>{funcionario.email}</span>
        </div>
        <div className='flex justify-end items-end space-x-2'>
          <div className='flex justify-center items-center gap-1'>
            {indisponivel && (<span className='text-red-500 text-xs'>Bloqueado</span>)}
            <Tooltip text={indisponibilidade}>
              <div className='inline-block'>
                <Button 
                  disabled={indisponivel} 
                  variant={indisponivel ? 'destructive' :'default'} 
                  size={'icon'} 
                  onClick={() => handleIndisponivelUser(funcionario.id)}
                ><Ban /></Button>
              </div>
            </Tooltip>
          </div>
          <Tooltip text='Editar'>
            <Button 
              variant={'default'} 
              size={'icon'} 
              onClick={() => handleEditUser(funcionario.id)}
            ><Pencil /></Button>
          </Tooltip>
          <Tooltip text='Deletar'>
            <Button 
              variant={'default'} 
              size={'icon'} 
              onClick={() => handleRemoveUser(funcionario.id)}
            ><Trash /></Button>
          </Tooltip>
            
        </div>
      </div>
    </div>
  )
}

export default CardUser
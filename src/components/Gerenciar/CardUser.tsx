import { Ban, BanIcon, BlocksIcon, Pencil, Trash, User } from 'lucide-react'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import Tooltip from '../Toolttip/Tooltip'

interface CardUserProps {
  funcionario: any
  handleEditUser: (id:string) => void
  handleRemoveUser: (id:string) => void
  handleIndisponivelUser: (id:string) => void
}

const CardUser = ({ funcionario, handleEditUser, handleRemoveUser, handleIndisponivelUser }: CardUserProps) => {
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
          <Tooltip text='Indisponibilidade'>
            <Button variant={'default'} size={'icon'} onClick={() => handleIndisponivelUser(funcionario.id)}><Ban /></Button>
          </Tooltip>
          <Tooltip text='Editar'>
            <Button variant={'default'} size={'icon'} onClick={() => handleEditUser(funcionario.id)}><Pencil /></Button>
          </Tooltip>
          <Tooltip text='Deletar'>
            <Button variant={'default'} size={'icon'} onClick={() => handleRemoveUser(funcionario.id)}><Trash /></Button>
          </Tooltip>
            
        </div>
      </div>
    </div>
  )
}

export default CardUser
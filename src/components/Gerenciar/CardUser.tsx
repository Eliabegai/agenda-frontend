import { Ban, BanIcon, BlocksIcon, Pencil, Trash, User } from 'lucide-react'
import { Button } from '../ui/button'


const CardUser = ({ funcionario }: any) => {
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
          <Button variant={'default'} size={'icon'} className=''><Ban /></Button>
          <Button variant={'default'} size={'icon'} className=''><Pencil /></Button>
          <Button variant={'default'} size={'icon'} className=''><Trash /></Button>
            
        </div>
      </div>
    </div>
  )
}

export default CardUser
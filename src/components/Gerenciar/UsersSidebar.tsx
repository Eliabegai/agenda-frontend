import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { useCurrentAdminOrUser, useFuncionarioContext } from '../hooks/PageContext'
import EmployeeModal from './FuncionarioModal'

interface UsersSidebarProps {
  email: string
  token: string | null
}

const UsersSidebar = ({email, token }:UsersSidebarProps) => {

  const {funcionario, funcionarios, funcionariosFilter, setFuncionario} = useFuncionarioContext()
  const {updateFuncionarios} = useCurrentAdminOrUser()
  const [openEdit, setOpenEdit] = useState<boolean>(false)

  const url = process.env.NEXT_PUBLIC_API_URL

  const handleViewUser = async (id: string) => {
    if (!token) {
      toast.error('Token não encontrado');
      return;
    }

    try{
      const response = await fetch(`${url}/user/${id}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          'token': token,
          'admin': email
        },
      })
      const data = await response.json()
      setOpenEdit(!openEdit)
      setFuncionario(data.data)
    } catch (error) {
      console.error('Erro ao buscar os dados', error)
      toast.error('Erro ao buscar os dados')
    }
  }

  useEffect(() => {
    if(funcionariosFilter.length === 0) {
      updateFuncionarios()
    }
  },[funcionariosFilter])

  return(
    <div className="flex flex-col w-full max-h-40 gap-1 border rounded-md p-2 mb-2 overflow-auto">

      <EmployeeModal open={openEdit} setOpen={() => setOpenEdit(!openEdit)} funcionario={funcionario} />

      <ul className="border-r border-gray-400">
        { funcionariosFilter?.length === 0 ? (
            funcionarios.map((funcionario) => {
              return(
                <Button key={funcionario.id} variant={'ghost'} onClick={() => handleViewUser(funcionario.id)} className='w-44 justify-start'>
                  <li key={funcionario.id} className="text-normal">{funcionario.nome}</li>
                </Button>
              )
            })
        ) : (
            funcionariosFilter?.map((funcionario) => {
              return(
                <Button key={funcionario.id} variant={'ghost'} onClick={() => handleViewUser(funcionario.id)} className='w-44 justify-start'>
                  <li key={funcionario.id} className="text-normal">{funcionario.nome}</li>
                </Button>
              )
            })  
        )
        }
      </ul>
    </div>
  )
}

export default UsersSidebar
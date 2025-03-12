'use client'

import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useCurrentAdminOrUser } from '../hooks/PageContext'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import CardUser from './CardUser'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Modal } from '../Dialog/Modal'
import FormUser from './FormUser'
import FormEditUser from './FormEditUser'


const Usuarios = () => {
  const router = useRouter()
  const { role, email, getToken } = useCurrentAdminOrUser()
  const [funcionarios, setFuncionarios] = useState<IFuncionario[]>([])
  const [funcionario, setFuncionario] = useState<IFuncionario | null>(null)
  const url = process.env.NEXT_PUBLIC_API_URL
  const token = typeof window !== 'undefined' ? getToken() : null
  const [userFilter, setUserFilter] = useState('')
  const [openCreate, setOpenCreate] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openRemove, setOpenRemove] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)


  // useEffect(() => {
  //   if(role !== 'ADMIN')
  //     router.push('/agenda')
  // },[])

  const getFuncionarios = async () => {
    if (!token) {
      toast.error('Token não encontrado');
      return;
    }
    
    try{
      const response = await fetch(`${url}/user`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          'token': token,
          'admin': email
        },
      })
      const data = await response.json()
      setFuncionarios(data.data)
    } catch (error) {
      console.error('Erro ao buscar os dados', error)
      toast.error('Erro ao buscar os dados')
    }

  }

  const getUserByName = async (nome: string) => {
    if (!token) {
      toast.error('Token não encontrado');
      return;
    }
    
    try{
      const response = await fetch(`${url}/user/filter?nome=${nome}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          'token': token,
          'admin': email
        },
      })
      const data = await response.json()
      setFuncionarios(data.getUser)
    } catch (error) {
      console.error('Erro ao buscar os dados', error)
      toast.error('Erro ao buscar os dados')
    }
  }

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setUserFilter(e?.target.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if(!userFilter) {
        getFuncionarios()
      } else {
        getUserByName(userFilter)
        toast.success(`Procurando usuário por nome: ${userFilter}`);
      }
    }
  };

  const submitIndisponivel = async (id: string, body: any) => {
    if (!token) {
      toast.error('Token não encontrado');
      return;
    }
    
    try{
      await fetch(`${url}/user/${id}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          'token': token,
          'admin': email
        },
        body: JSON.stringify(body)
      })
      toast.success('Indisponibilidade Cadastrada!')
      getFuncionarios()
    } catch (error) {
      console.error('Erro ao cadastrar.', error)
      toast.error('Erro ao cadastrar.')
    }
  }

  const submitEditUser = async (id: string, body: any) => {
    if (!token) {
      toast.error('Token não encontrado');
      return;
    }
    
    try{
      await fetch(`${url}/user/${id}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          'token': token,
          'admin': email
        },
        body: JSON.stringify(body)
      })
      toast.success('Usuário Atualizado com Sucesso!')
      getFuncionarios()
    } catch (error) {
      console.error('Erro ao atualizar Usuário!', error)
      toast.error('Erro ao atualizar Usuário!')
    }
  }

  const submitRemoveUser = async (id: string) => {
    if (!token) {
      toast.error('Token não encontrado');
      return;
    }
    
    try{
      await fetch(`${url}/user/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          'token': token,
          'admin': email
        }
      })
      toast.success('Usuário Removido com Sucesso!')
      getFuncionarios()
    } catch (error) {
      console.error('Erro ao remover Usuário!', error)
      toast.error('Erro ao remover Usuário!')
    }
  }

  const handleIndisponivel = async (id: string) => {}

  const handleEditUser = async (id: string) => {
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
      console.log(data)
      setFuncionario(data.data)
    } catch (error) {
      console.error('Erro ao buscar os dados', error)
      toast.error('Erro ao buscar os dados')
    }
  }

  const handleRemoveUser = async (id: string) => {}

  const onSubmitUser = async (body: any) => {
    setIsLoading(true)
    setOpenEdit(!openEdit)
    if (!token) {
      toast.error('Token não encontrado');
      return;
    }
    
    try{
      await fetch(`${url}/auth/register`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          'token': token,
          'admin': email
        },
        body:JSON.stringify(body)
      })
      toast.success('Usuário Criado com Sucesso!')
      setIsLoading(false)
      setOpenCreate(false)
      getFuncionarios()
    } catch (error) {
      console.error('Erro ao criar Usuário!', error)
      setIsLoading(false)
      toast.error('Erro ao criar Usuário!')
    }
  }

  useEffect(() => {
    getFuncionarios()
  },[])

  return(
    <div className='flex flex-col w-full h-full p-2 items-center justify-center gap-4'>

      <div className='flex h-20 border w-full'>
        <Input 
          type='search' 
          value={userFilter} 
          onChange={handleSearch}
          onKeyDown={handleKeyDown} />
      </div>

      <Modal open={openCreate} openChange={() => setOpenCreate(!openCreate)} closeFooter>
        <FormUser onSubmit={onSubmitUser} cancel={() => setOpenCreate(!openCreate)} />
      </Modal>

      <Modal open={openEdit} openChange={() => setOpenEdit(!openEdit)} closeFooter>
        <FormEditUser onSubmit={submitEditUser} cancel={() => setOpenEdit(!openEdit)} userData={funcionario} />
      </Modal>

      <div className='flex flex-col w-full h-full'>
        
        <div className='flex w-full h-20 justify-between items-center px-2'>
          <h2 className='text-xl'>Funcionários</h2>
          <div className='flex place-items-center justify-center items-center rounded-full'>
            <Button 
              variant={'outline'} 
              className='flex w-16 h-16 rounded-full bg-zinc-400 dark:bg-zinc-700 hover:bg-zinc-500 hover:dark:bg-zinc-600'
              onClick={() => setOpenCreate(!openCreate)}
            >
              <Plus size={'52px'} />
            </Button>
          </div>
        </div>

        {/* Card Funcionario/User */}
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 justify-center items-center place-items-center gap-4'>
          {
            funcionarios &&
            funcionarios.map((funcionario) => (
              <CardUser key={funcionario.id} funcionario={funcionario} handleEditUser={handleEditUser} />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Usuarios
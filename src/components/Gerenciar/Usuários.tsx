'use client'

import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useCurrentAdminOrUser, useFuncionarioContext } from '../hooks/PageContext'
import { useRouter } from 'next/navigation'
import { Plus, Search, TriangleAlert } from 'lucide-react'
import CardUser from './CardUser'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Modal } from '../Dialog/Modal'
import FormUser from './FormUser'
import FormEditUser from './FormEditUser'
import FormIndisponivelUser from './FormIndisponivelUser'
import FuncionarioModal from './FuncionarioModal'


const Usuarios = () => {
  const router = useRouter()
  const { role, email, getToken, updateFuncionarios } = useCurrentAdminOrUser()
  const {funcionariosFilter, funcionario, funcionarios, setFuncionario, setFuncionariosFilter} = useFuncionarioContext()
  const url = process.env.NEXT_PUBLIC_API_URL
  const token = typeof window !== 'undefined' ? getToken() : null
  const [userFilter, setUserFilter] = useState('')
  const [openCreate, setOpenCreate] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openRemove, setOpenRemove] = useState<boolean>(false)
  const [openIndisponivel, setOpenIndisponivel] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [idUsuario, setIdUsuario] = useState('')


  useEffect(() => {
    if(role !== 'ADMIN')
      router.push('/agenda')
  },[])

  const getUserByName = async (nome: string) => {
    if (!token) {
      toast.error('Token não encontrado');
      return;
    }
    
    try {
      const response = await fetch(`${url}/user/filter?nome=${nome}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          'token': token,
          'admin': email
        },
      })
      if(!response.ok) {
        const errorData = await response.json()
        toast.error('Erro ao Cadastrar Reunião', {
          description: (
          <span>{errorData.message || errorData.error}</span>
          )
        })
        throw new Error(errorData.message || errorData.error || 'Tente novamente mais tarde.')
      }

      const data = await response.json()
      setFuncionariosFilter(data.data)
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
      if(userFilter) {
        getUserByName(userFilter)
        toast.success(`Procurando usuário por nome: ${userFilter}`);
      } else {
        updateFuncionarios()
        setFuncionariosFilter([])
      }
    }
  };

  const submitIndisponivel = async (id: string, body: any) => {
    if (!token) {
      toast.error('Token não encontrado');
      return;
    }
    setIsLoading(!isLoading)
    
    try {
      const response = await fetch(`${url}/user/${id}/indisponibilidade`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          'token': token,
          'admin': email
        },
        body: JSON.stringify(body)
      })
      if(!response.ok) {
        const errorData = await response.json()
        toast.error('Erro ao Cadastrar Reunião', {
          description: (
          <span>{errorData.message || errorData.error}</span>
          )
        })
        throw new Error(errorData.message || errorData.error || 'Tente novamente mais tarde.')
      }
      toast.success('Indisponibilidade Cadastrada!')
      setIsLoading(false)
      setOpenIndisponivel(false)
      updateFuncionarios()
    } catch (error) {
      console.error('Erro ao cadastrar.', error)
      toast.error('Erro ao cadastrar.')
    }
  }

  const submitEditUser = async (id: string, body: any) => {
    setIsLoading(!isLoading)
    if (!token) {
      toast.error('Token não encontrado');
      return;
    }
    
    try {
      const response = await fetch(`${url}/user/${id}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          'token': token,
          'admin': email
        },
        body: JSON.stringify(body)
      })
      if(!response.ok) {
        const errorData = await response.json()
        toast.error('Erro ao Cadastrar Reunião', {
          description: (
          <span>{errorData.message || errorData.error}</span>
          )
        })
        throw new Error(errorData.message || errorData.error || 'Tente novamente mais tarde.')
      }

      toast.success('Usuário Atualizado com Sucesso!')
      setOpenEdit(false)
      setIsLoading(false)
      updateFuncionarios()
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
    
    try {
      const response = await fetch(`${url}/user/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          'token': token,
          'admin': email
        }
      })

      if(!response.ok) {
        const errorData = await response.json()
        toast.error('Erro ao Cadastrar Reunião', {
          description: (
          <span>{errorData.message || errorData.error}</span>
          )
        })
        throw new Error(errorData.message || errorData.error || 'Tente novamente mais tarde.')
      }

      toast.success('Usuário Removido com Sucesso!')
      setOpenRemove(false)
      updateFuncionarios()
    } catch (error) {
      console.error('Erro ao remover Usuário!', error)
      toast.error('Erro ao remover Usuário!')
    }
  }

  const handleIndisponivel = async (id: string) => {
    setIdUsuario(id)
    setOpenIndisponivel(!openIndisponivel)
  }

  const handleEditUser = async (id: string) => {
    if (!token) {
      toast.error('Token não encontrado');
      return;
    }

    try {
      const response = await fetch(`${url}/user/${id}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          'token': token,
          'admin': email
        },
      })

      if(!response.ok) {
        const errorData = await response.json()
        toast.error('Erro ao Cadastrar Reunião', {
          description: (
          <span>{errorData.message || errorData.error}</span>
          )
        })
        throw new Error(errorData.message || errorData.error || 'Tente novamente mais tarde.')
      }

      const data = await response.json()
      setOpenEdit(!openEdit)
      setFuncionario(data.data)
    } catch (error) {
      console.error('Erro ao buscar os dados', error)
      toast.error('Erro ao buscar os dados')
    }
  }

  const handleRemoveUser = async (id: string) => {
    setOpenRemove(!openRemove)

    if (!token) {
      toast.error('Token não encontrado');
      return;
    }

    try {
      const response = await fetch(`${url}/user/${id}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          'token': token,
          'admin': email
        },
      })
      if(!response.ok) {
        const errorData = await response.json()
        toast.error('Erro ao Cadastrar Reunião', {
          description: (
          <span>{errorData.message || errorData.error}</span>
          )
        })
        throw new Error(errorData.message || errorData.error || 'Tente novamente mais tarde.')
      }
      
      const data = await response.json()
      setFuncionario(data.data)
    } catch (error) {
      console.error('Erro ao buscar os dados', error)
      toast.error('Erro ao buscar os dados')
    }
  }

  const onSubmitUser = async (body: any) => {
    setIsLoading(true)
    setOpenEdit(!openEdit)
    if (!token) {
      toast.error('Token não encontrado');
      return;
    }
    
    try {
      const response = await fetch(`${url}/auth/register`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          'token': token,
          'admin': email
        },
        body:JSON.stringify(body)
      })
      
      if(!response.ok) {
        const errorData = await response.json()
        toast.error('Erro ao Cadastrar Reunião', {
          description: (
          <span>{errorData.message || errorData.error}</span>
          )
        })
        throw new Error(errorData.message || errorData.error || 'Tente novamente mais tarde.')
      }

      toast.success('Usuário Criado com Sucesso!')
      setIsLoading(false)
      setOpenCreate(false)
      updateFuncionarios()
    } catch (error) {
      console.error('Erro ao criar Usuário!', error)
      setIsLoading(false)
      toast.error('Erro ao criar Usuário!')
    }
  }

  useEffect(() => {
    updateFuncionarios()
  },[userFilter])

  return(
    <div className='flex flex-col w-full h-full p-2 items-center justify-center gap-4'>

      <div className='flex w-full justify-center items-center gap-1 px-4'>
        <Input 
          type='search'
          value={userFilter}
          placeholder='Pesquisar Funcionário'
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
        />
        <Button variant={'outline'} onClick={() => getUserByName(userFilter)}>
          <Search />
        </Button>
      </div>

      <FuncionarioModal open={openEdit} setOpen={() => setOpenEdit(!openEdit)} funcionario={funcionario} />

      <Modal open={openCreate} openChange={() => setOpenCreate(!openCreate)} closeFooter>
        <FormUser onSubmit={onSubmitUser} cancel={() => setOpenCreate(!openCreate)} />
      </Modal>

      {/* <Modal open={openEdit} openChange={() => setOpenEdit(!openEdit)} closeFooter>
        <FormEditUser onSubmit={submitEditUser} cancel={() => setOpenEdit(!openEdit)} userData={funcionario} />
      </Modal> */}
      
      <Modal open={openIndisponivel} openChange={() => setOpenIndisponivel(!openIndisponivel)} closeFooter>
        <FormIndisponivelUser 
          onSubmit={submitIndisponivel} 
          id={idUsuario} 
          cancel={() => setOpenIndisponivel(!openIndisponivel)}
        />
      </Modal>

      <Modal open={openRemove} openChange={() => setOpenRemove(!openRemove)} closeFooter>
        {
          funcionario && (
            <div>
              <div className='mt-2 flex flex-col justify-center items-center gap-6'>
                <div className='text-2xl flex flex-col justify-center items-center gap-6'>
                  <span><TriangleAlert size={'72px'} /></span>
                  <span className=''>Tem certeza que deseja deletar o funcionário?</span>
                </div>
                <div className='flex space-x-2 items-end'>
                  <span>Nome:</span>
                  <span className='text-xl font-semibold underline italic'>{funcionario?.nome}</span>
                </div>

                <div className='mb-2 flex justify-evenly w-full'>
                  <Button variant={'destructive'} onClick={() => submitRemoveUser(funcionario?.id)} >Remover</Button>
                  <Button variant={'outline'} onClick={() => setOpenRemove(!openRemove)} >Cancelar</Button>
                </div>
              </div>
            </div>
          )
        }
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

        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 justify-center items-center place-items-center gap-2'>
          {
            funcionariosFilter?.length === 0 ? (
              funcionarios.map((funcionario) => (
                <CardUser 
                  key={funcionario.id} 
                  funcionario={funcionario} 
                  handleEditUser={handleEditUser} 
                  handleRemoveUser={handleRemoveUser}
                  handleIndisponivelUser={handleIndisponivel}
                />
              ))
            ) : (
              funcionariosFilter?.map((funcionario) => (
                <CardUser 
                  key={funcionario.id} 
                  funcionario={funcionario} 
                  handleEditUser={handleEditUser} 
                  handleRemoveUser={handleRemoveUser}
                  handleIndisponivelUser={handleIndisponivel}
                />
              ))
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Usuarios
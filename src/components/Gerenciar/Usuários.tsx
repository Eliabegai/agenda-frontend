'use client'

import { KeyboardEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useCurrentAdminOrUser, useFuncionarioContext } from '../hooks/PageContext'
import { useRouter } from 'next/navigation'
import { PlusCircle, Search } from 'lucide-react'
import CardUser from './CardUser'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import FormUser from './FormUser'
import FormEditUser from './FormEditUser'
import FormIndisponivelUser from './FormIndisponivelUser'
import { DeleteConfirmationDialog } from './DeleteConfirmation'
import { ScrollArea } from '../ui/scroll-area'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog'
import SkeletonFuncionarioForm from '../Skeletons/SkeletonFuncionarioForm'
import SkeletonFuncionariosList from '../Skeletons/SkeletonFuncionarioList'
import SkeletonDeleteFuncionario from '../Skeletons/SkeletonDeleteFuncionario'


const Usuarios = () => {
  const router = useRouter()
  const { role, email, getToken, updateFuncionarios, loadingFuncionario } = useCurrentAdminOrUser()
  const {funcionariosFilter, funcionario, funcionarios, setFuncionario, setFuncionariosFilter} = useFuncionarioContext()
  const [token, setToken] = useState<string | null>(null)
  const url = process.env.NEXT_PUBLIC_API_URL
  const [userFilter, setUserFilter] = useState('')
  const [openCreate, setOpenCreate] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openRemove, setOpenRemove] = useState<boolean>(false)
  const [openIndisponivel, setOpenIndisponivel] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [idUsuario, setIdUsuario] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false)

  useEffect(() => {
    if(role !== 'ADMIN')
      router.push('/agenda')
  },[])

  useEffect(() => {
  if(typeof window !== 'undefined') {
    setToken(getToken())
  }
   
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
      updateFuncionarios()
    } catch (error) {
      console.error('Erro ao cadastrar.', error)
    } finally {
      setIsLoading(false)
      setOpenIndisponivel(false)
    }
  }

  const submitEditUser = async (id: string, body: any) => {
    setIsLoading(true)
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
      updateFuncionarios()
    } catch (error) {
      console.error('Erro ao atualizar Usuário!', error)
    } finally {
      setIsLoading(false)
      setOpenEdit(false)
    }
  }

  const submitRemoveUser = async (id: string) => {
    if (!token) {
      toast.error('Token não encontrado');
      return;
    }
    setIsLoading(true)
    
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
      updateFuncionarios()
    } catch (error) {
      console.error('Erro ao remover Usuário!', error)
    } finally {
      setIsLoading(false)
      setOpenRemove(false)
    }
  }

  const handleIndisponivel = async (id: string) => {
    setIdUsuario(id)
    setOpenIndisponivel(!openIndisponivel)
  }

  const handleEditUser = async (id: string) => {
    setLoading(true)
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
      setOpenEdit(true)
    } catch (error) {
      console.error('Erro ao buscar os dados', error)
      toast.error('Erro ao buscar os dados')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveUser = async (id: string) => {
    
    setLoadingDelete(true)
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
      setOpenRemove(!openRemove)
    } catch (error) {
      console.error('Erro ao buscar os dados', error)
      toast.error('Erro ao buscar os dados')
    } finally {
      setLoadingDelete(false)
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
      updateFuncionarios()

    } catch (error) {
      console.error('Erro ao criar Usuário!', error)
    } finally {
      setIsLoading(false)
      setOpenCreate(false)
    }
  }

  return(
    <div className='flex flex-col w-full h-full p-2 items-center justify-center gap-4'>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex w-full max-w-lg relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar funcionários..."
            className="pl-8"
            value={userFilter}
            onChange={(e) => setUserFilter(e?.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className='flex w-full h-20 justify-between items-center px-2'>
          <div className='flex place-items-center justify-center items-center rounded-full'>
            <Button onClick={() => setOpenCreate(!openCreate)} className="w-full sm:w-auto gap-1.5">
              <PlusCircle className="h-4 w-4" />
              Adicionar Funcionário
            </Button>
          </div>
        </div>
      </div>

      <div>
        <Dialog open={loading}>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
          <DialogContent>
            <SkeletonFuncionarioForm />
          </DialogContent>
        </Dialog>

        <Dialog open={loadingDelete}>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
          <DialogContent>
            <SkeletonDeleteFuncionario />
          </DialogContent>
        </Dialog>

        <Dialog open={openCreate} onOpenChange={() => setOpenCreate(!openCreate)}>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
          <DialogContent>
            <FormUser onSubmit={onSubmitUser} cancel={() => setOpenCreate(!openCreate)} loading={isLoading} />
          </DialogContent>
        </Dialog>

        <Dialog open={openEdit} onOpenChange={() => setOpenEdit(!openEdit)}>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
          <DialogContent>
            <FormEditUser onSubmit={submitEditUser} cancel={() => setOpenEdit(!openEdit)} userData={funcionario} />
          </DialogContent>
        </Dialog>

        <Dialog open={openIndisponivel} onOpenChange={() => setOpenIndisponivel(!openIndisponivel)}>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
          <DialogContent>
            <FormIndisponivelUser 
              onSubmit={submitIndisponivel} 
              id={idUsuario} 
              cancel={() => setOpenIndisponivel(!openIndisponivel)}
            />
          </DialogContent>
        </Dialog>

        <DeleteConfirmationDialog open={openRemove} onDelete={submitRemoveUser} funcionario={funcionario} onOpenChange={() => setOpenRemove(!openRemove)} />
      </div>


      <div className='flex flex-col w-full h-full p-4'>
        { 
          funcionariosFilter.length === 0 && userFilter ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">Nenhum funcionário encontrado</h3>
              <p className="text-sm text-muted-foreground mt-1">Tente ajustar sua busca ou adicione um novo funcionário.</p>
            </div>
          ) : (
            loadingFuncionario  ? <SkeletonFuncionariosList /> :
            <ScrollArea className="h-[calc(100vh-220px)]">
              <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-3 pb-4">
                {
                (userFilter ? funcionariosFilter : funcionarios).map((funcionario) => (
                  <CardUser
                    key={funcionario.id}
                    funcionario={funcionario}
                    handleEditUser={handleEditUser}
                    handleRemoveUser={handleRemoveUser}
                    handleIndisponivelUser={handleIndisponivel}
                  />
                ))}
              </div>
            </ScrollArea>
          )
        }
      </div>
    </div>
  )
}

export default Usuarios
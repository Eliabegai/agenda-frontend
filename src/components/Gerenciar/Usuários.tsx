'use client'

import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useCurrentAdminOrUser, useFuncionarioContext } from '../hooks/PageContext'
import { useRouter } from 'next/navigation'
import { Plus, Search, Trash2, TriangleAlert, UserCircle } from 'lucide-react'
import CardUser from './CardUser'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Modal } from '../Dialog/Modal'
import FormUser from './FormUser'
import FormEditUser from './FormEditUser'
import FormIndisponivelUser from './FormIndisponivelUser'
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardFooter } from '../ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import { DeleteConfirmationDialog } from './DeleteConfirmation'


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
      updateFuncionarios()
    } catch (error) {
      console.error('Erro ao criar Usuário!', error)
    } finally {
      setIsLoading(false)
      setOpenCreate(false)
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

      <Modal open={openCreate} openChange={() => setOpenCreate(!openCreate)} closeFooter>
        <FormUser onSubmit={onSubmitUser} cancel={() => setOpenCreate(!openCreate)} loading={isLoading} />
      </Modal>

      <Modal open={openEdit} openChange={() => setOpenEdit(!openEdit)} closeFooter>
        <FormEditUser onSubmit={submitEditUser} cancel={() => setOpenEdit(!openEdit)} userData={funcionario} />
      </Modal>
      
      <Modal open={openIndisponivel} openChange={() => setOpenIndisponivel(!openIndisponivel)} closeFooter>
        <FormIndisponivelUser 
          onSubmit={submitIndisponivel} 
          id={idUsuario} 
          cancel={() => setOpenIndisponivel(!openIndisponivel)}
        />
      </Modal>

      {/* <Modal open={openRemove} openChange={() => setOpenRemove(!openRemove)} closeFooter>
        {
          funcionario && (
            <Card className="max-w-md mx-auto border border-destructive/20">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-6 text-center">
                  <div className="rounded-full bg-destructive/10 p-3 text-destructive">
                    <TriangleAlert size={40} />
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Confirmar exclusão</h2>
                    <p className="text-muted-foreground">
                      Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita.
                    </p>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg px-4 py-3 w-full">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Nome:</span>
                      <span className="font-medium">{funcionario?.nome}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex w-full justify-between gap-4 pt-2">
                <Button 
                  variant="outline"  
                  className='w-1/2'
                  onClick={() => setOpenRemove(!openRemove)}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="destructive"
                  className='w-1/2'
                  onClick={() => submitRemoveUser(funcionario?.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </Button>
              </CardFooter>
            </Card>
          )
        }
      </Modal> */}

      {/* <AlertDialog open={openRemove} onOpenChange={setOpenRemove}>
        {funcionario && (
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <div className="mx-auto rounded-full bg-destructive/10 p-3 text-destructive">
                <TriangleAlert size={40} />
              </div>
              <AlertDialogTitle className="text-center mt-4">
                Excluir funcionário
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center">
                Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="bg-muted/50 rounded-lg px-4 py-3 my-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Nome:</span>
                <span className="font-medium">{funcionario?.nome}</span>
              </div>
            </div>
            
            <AlertDialogFooter className="flex w-full justify-center items-center gap-4 sm:gap-0">
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => submitRemoveUser(funcionario?.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog> */}
      {/* {
        funcionario &&
        <AlertDialog open={openRemove} onOpenChange={setOpenRemove}>
          <AlertDialogContent className="max-w-lg gap-0 p-0 overflow-hidden border-none shadow-lg">
            <div className="bg-destructive/10 p-6 text-center border-b">
              <div className="mx-auto size-16 rounded-full bg-destructive/20 flex items-center justify-center mb-4">
                <TriangleAlert className="size-8 text-destructive" />
              </div>
              <AlertDialogHeader className="gap-2 text-center">
                <AlertDialogTitle className="text-xl">
                  Excluir funcionário
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-muted/40 rounded-lg p-4 border border-border/50">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Funcionário
                  </span>
                  <span className="font-medium text-lg">{funcionario?.nome}</span>
                </div>
              </div>
              
              <AlertDialogFooter className="flex-row gap-3 p-0">
                <AlertDialogCancel 
                  className="mt-0 w-1/2 text-sm font-medium"
                  onClick={() => setOpenRemove(false)}
                >
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction 
                  className="mt-0 w-1/2 bg-destructive hover:bg-destructive/90 text-sm font-medium"
                  onClick={() => {
                    submitRemoveUser(funcionario?.id);
                    setOpenRemove(false);
                  }}
                >
                  <Trash2 className="mr-2 size-4" />
                  Excluir permanentemente
                </AlertDialogAction>
              </AlertDialogFooter>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      } */}

      {/* <AnimatePresence>
        {funcionario && openRemove && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md overflow-hidden rounded-lg border bg-card shadow-lg"
            >
              <div className="relative overflow-hidden">
                
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-destructive to-destructive/70" />
                
                
                <div className="bg-destructive/5 p-6 text-center">
                  <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-destructive/10">
                    <motion.div
                      initial={{ rotate: -90 }}
                      animate={{ rotate: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <TriangleAlert className="size-10 text-destructive" />
                    </motion.div>
                  </div>
                  <h2 className="text-2xl font-bold">Excluir funcionário</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Você está prestes a excluir permanentemente este funcionário.
                    Esta ação não pode ser desfeita.
                  </p>
                </div>
                
                
                <div className="p-6 space-y-6">
                  
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Funcionário
                      </span>
                      <div className="flex items-center gap-2">
                        <UserCircle className="size-5 text-muted-foreground" />
                        <span className="font-medium text-lg">{funcionario?.nome}</span>
                      </div>
                    </div>
                  </div>
                  
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="w-1/2"
                      onClick={() => setOpenRemove(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="w-1/2 group"
                      onClick={() => {
                        submitRemoveUser(funcionario?.id);
                        setOpenRemove(false);
                      }}
                    >
                      <Trash2 className="mr-2 size-4 transition-transform group-hover:scale-110" />
                      <span>Excluir</span>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence> */}

      <DeleteConfirmationDialog open={openRemove} onDelete={submitRemoveUser} funcionario={funcionario} onOpenChange={() => setOpenRemove(!openRemove)} />

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
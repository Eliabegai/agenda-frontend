'use client'
import { KeyboardEvent, useEffect, useState } from 'react';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Calendar } from '../ui/calendar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCurrentAdminOrUser, useCurrentCliente, useCurrentDate, useFuncionarioContext } from '../hooks/PageContext';
import { useRouter } from 'next/navigation';
import UsersSidebar from '../Gerenciar/UsersSidebar';
import { toast } from 'sonner';

const Sidebar = () => {

  const {setFuncionariosFilter} = useFuncionarioContext()
  const [name, setName] = useState('')
  const { currentDate, setCurrentDate} = useCurrentDate()
  const router = useRouter()
  const {email, getToken} = useCurrentAdminOrUser()
  const token = getToken()
  const url = process.env.NEXT_PUBLIC_API_URL
    
  const handleClickFuncionario = () => {
    router.push('/gerenciar')
  }

  const getUserByName = async (nome: string) => {
    if (!token) {
      toast.error('Token não encontrado');
      return;
    }

    if(nome === "") {
      setFuncionariosFilter([])
    } else {
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
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if(name) {
          getUserByName(name)
          toast.success(`Procurando usuário por nome: ${name}`);
        } else {
          setFuncionariosFilter([])
        }
      }
    };

  const handleDateChange = (date: Date | undefined) => {
    if(date) {
      setCurrentDate(date)
    }
  }

  return(
    <aside className="flex flex-col fixed top-20 left-0 w-72 h-full border-r border-[var(--background-azul)] p-2 items-center text-sm gap-3 overflow-auto">
      
      <div className="flex w-full items-center justify-center">
        <Calendar 
          mode="single" 
          className="border w-auto h-auto shadow-lg shadow-primary/20 rounded-2xl" 
          selected={currentDate} 
          onSelect={handleDateChange} 
          onMonthChange={handleDateChange}
          month={currentDate}
          weekStartsOn={0}
        />
      </div>
      
      <div className='flex w-full justify-center items-center'>
        <Button onClick={handleClickFuncionario} className="bg-[var(--background-azul)]">Gerenciar Funcionarios</Button>
      </div>
      
      <div className="flex w-64 items-center py-2 px-3 space-x-1">
          <Input type="text" placeholder="Buscar Funcionario" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={handleKeyDown} />
        <Button onClick={() => getUserByName(name)} className="bg-[var(--background-azul)]" ><FontAwesomeIcon icon={faMagnifyingGlass} /></Button>
      </div>

      <UsersSidebar email={email} token={token} />

    </aside>
  )
}

const SidebarCliente = () => {
  const { currentDate, setCurrentDate} = useCurrentDate()
  const { cliente } = useCurrentCliente()
  const {funcionario} = useFuncionarioContext()

  const handleDateChange = (date: Date | undefined) => {
    if(date) {
      setCurrentDate(date)
    }
  }

  useEffect(() => {

  },[cliente])

  return(
    <aside className="flex flex-col fixed top-20 left-0 w-72 h-full border-r border-[var(--background-azul)] p-2 items-center text-sm gap-3 overflow-auto">
      
      <div className="flex w-full items-center justify-center">
        <Calendar 
          mode="single" 
          className="border w-auto h-auto shadow-lg shadow-primary/20 rounded-2xl" 
          selected={currentDate} 
          onSelect={handleDateChange} 
          onMonthChange={handleDateChange}
          month={currentDate}
          weekStartsOn={0}
        />
      </div>
      
      {
        funcionario && funcionario.role &&
        <div className='flex flex-col justify-start w-full p-2 ml-10 mt-6 space-y-4'>
          <div>
            <span>Bem vindo,</span>
            <h2 className='text-lg font-semibold'>{funcionario.nome}</h2>
          </div>
        </div>
      }
      {
        cliente &&
        <div className='flex flex-col justify-start w-full p-2 ml-10 mt-6 space-y-4'>
          <div>
            <span>Bem vindo,</span>
            <h2 className='text-lg font-semibold'>{cliente}</h2>
          </div>
        </div>
      }

    </aside>
  )
}


export { Sidebar, SidebarCliente };
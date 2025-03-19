"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { addDays } from 'date-fns';
import { toast } from 'sonner';

interface UserDataProps {
  nome: string
  role: string
  email: string
  id: string
}

interface CurrentDateContextProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  changeWeek: (weeks: number) => void;
}

interface CurrentClienteContextProps {
  cliente: string
  role: string
  setCliente: (nome: string) => void
  setRole: (role: string) => void
  getToken: () => string | null
  saveToken: (token: string) => void
}

interface CurrentAdminOrUserProps {
  role: string
  nome: string
  email: string
  id: string
  funcionarios: IFuncionario[]
  loadingFuncionario: boolean
  setNome: (nome: string) => void
  setId: (id: string) => void
  setEmail: (email: string) => void
  setRole: (role: string) => void
  getToken: () => string | null
  getUserData: () => UserDataProps | null
  saveToken: (token: string) => void
  Logout: () => void
  Login: (body:{email:string, senha:string}) => Promise<ILogin | null>
  updateFuncionarios: () => void
  setLoadingFuncionario: (state: boolean) => void
}

interface FuncionarioContextProps {
  funcionarios: IFuncionario[]
  funcionariosFilter: IFuncionario[]
  funcionario: IFuncionario | null
  agendamentos: IAgendamento[]
  getToken: () => string | null
  getUserData: () => UserDataProps | null
  setFuncionarios: (funcionarios: IFuncionario[]) => void
  setFuncionariosFilter: (funcionarios: IFuncionario[]) => void
  setFuncionario: (funcionario: IFuncionario) => void
  setAgendamentos: (agendamento: IAgendamento[]) => void
  getAgendamentosByFuncionario: (id: string) => void
  getFuncionarioById: (id: string) => void
  updateFuncionario: (id: string) => void
}

const CurrentDateContext = createContext<CurrentDateContextProps | undefined>(undefined);
const CurrentClienteContext = createContext<CurrentClienteContextProps | undefined>(undefined);
const CurrentAdminOrUserContext = createContext<CurrentAdminOrUserProps | undefined>(undefined);
const FuncionarioContext = createContext<FuncionarioContextProps | undefined>(undefined);


export const ContextProvider = ({ children }: { children: ReactNode }) => {

  const [funcionarios, setFuncionarios] = useState<IFuncionario[]>([])
  const [funcionariosFilter, setFuncionariosFilter] = useState<IFuncionario[]>([])
  const [funcionario, setFuncionario] = useState<IFuncionario | null>(null)
  const [agendamentos, setAgendamentos] = useState<IAgendamento[]>([])
  const [currentDate, setCurrentDate] = useState(new Date());
  const [cliente, setClienteState] = useState('')
  const [role, setRoleState] = useState('')
  const [email, setEmailState] = useState('')
  const [nome, setNomeState] = useState('')
  const [id, setIdState] = useState('')
  const [loadingFuncionario, setLoadingFuncionario] = useState<boolean>(false)
  const url = process.env.NEXT_PUBLIC_API_URL

  function clearFields() {
    setFuncionarios([])
    setFuncionario(null)
    setFuncionariosFilter([])
    setAgendamentos([])
    sessionStorage.clear()
    localStorage.removeItem('user')
  }

  useEffect(() => {
    const storadCliente = localStorage.getItem('cliente')
    const storadUser = localStorage.getItem('user')
    const token = sessionStorage.getItem('token')
    
    if(!token) {
      localStorage.removeItem('user')
    }

    if(storadCliente) {
      setClienteState(storadCliente)
    }

    if (storadUser) {
      const userData = JSON.parse(storadUser);
      setNomeState(userData.user);
      setRoleState(userData.role);
      setEmailState(userData.email);
    }
  },[])

  const setCliente = (nome: string) => {
    setClienteState(nome)
    localStorage.setItem('cliente', nome)
  }

  const setEmail = (email: string) => {
    setEmailState(email)
    localStorage.removeItem('cliente')
  }

  const setNome = (nome: string) => {
    setNomeState(nome)
  }

  const setId = (id: string) => {
    setIdState(id)
  }

  const getUserData = () => {
    const storadUser = localStorage.getItem('user')
    if(storadUser) {
      const user = JSON.parse(storadUser)
      return user
    }
    return null
  }

  const changeWeek = (weeks: number) => {
    setCurrentDate(addDays(currentDate, weeks * 7));
  };

  const saveToken = (token: string) => {
    sessionStorage.setItem('token', token)
  }

  const getToken = () => {
    if(typeof window !== 'undefined') {
      const token = sessionStorage?.getItem('token') || null
      return token
    }
    return null
  }

  const setRole = (role: string) => {
    setRoleState(role)
  }

  const Login = async (body: {email:string, senha:string}): Promise<ILogin | null> => {
    try {
      const response = await fetch(`${url}/auth/login`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
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

      const data = await response.json();
      return { access_token: data.access_token };

    } catch (error) {
      console.error('Erro ao buscar os dados', error)
      return null
    }
  }

  const Logout = async () => {
 
    const token = getToken()
    if (!token) {
      toast.error('Token não encontrado');
      return;
    }
    
    try {
      const response = await fetch(`${url}/auth/logout`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          'token': token
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

      toast.success("Saíndo", {
        description: (
          <div>
            <h3>Volte Sempre!</h3>
          </div>
        )
      })

      clearFields()
    } catch (error) {
      console.error('Erro ao buscar os dados', error)
      toast.error('Erro ao buscar os dados')
    }
  }

  const updateFuncionarios = async () => {
    setLoadingFuncionario(true)
    const token = getToken()
    if (!token) {
      toast.error('Token não encontrado');
      return;
    }
    
    try {
      const response = await fetch(`${url}/user`, {
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
      setFuncionarios(data.data)
    } catch (error) {
      console.error('Erro ao buscar os dados', error)
      toast.error('Erro ao buscar os dados')
    } finally {
      setLoadingFuncionario(false)
    }
  }

  const getAgendamentosByFuncionario = async (id: string) => {
    const token = getToken()
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
      setAgendamentos(data?.data?.agendamentos)
    } catch (error) {
      console.error('Erro ao buscar os dados', error)
      toast.error('Erro ao buscar os dados')
    }
  }

  const getFuncionarioById = async (id: string) => {
    const token = getToken()
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
  
  const saveInStorageFuncionario = () => {
    if(funcionario)
      saveInStorage(funcionario.nome, funcionario.role, funcionario?.email, funcionario.id)
  }

  const updateFuncionario = async (id: string) => {
    const token = getToken()
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
      const data = await response.json()
      setFuncionario(data.data)
    } catch (error) {
      console.error('Erro ao buscar os dados', error)
      toast.error('Erro ao buscar os dados')
    } finally {
      saveInStorageFuncionario()
    }
  }

  const saveInStorage = (nome: string, role: string, email:string, id:string) => {
    const storageItens = { 'user': nome, 'role': role, 'email': email, 'id': id }
    localStorage.setItem('user', JSON.stringify(storageItens))
  }

  return (
    <CurrentDateContext.Provider value={{ currentDate, setCurrentDate, changeWeek }}>
      <CurrentClienteContext.Provider value={{ cliente, role, setCliente, setRole, getToken, saveToken }}>
        <CurrentAdminOrUserContext.Provider value={{loadingFuncionario, role, email, nome, id, setEmail, setNome, setRole, setId, getToken, saveToken, getUserData, Logout, updateFuncionarios, setLoadingFuncionario, funcionarios, Login }}>
          <FuncionarioContext.Provider value={{funcionario, funcionarios, funcionariosFilter, agendamentos, setAgendamentos, setFuncionario, setFuncionarios, setFuncionariosFilter, getAgendamentosByFuncionario, getUserData, getToken, getFuncionarioById, updateFuncionario}}>
            {children}
          </FuncionarioContext.Provider>
        </CurrentAdminOrUserContext.Provider>
      </CurrentClienteContext.Provider>
    </CurrentDateContext.Provider>
  );
};


export const useCurrentDate = (): CurrentDateContextProps => {
  const context = useContext(CurrentDateContext);
  if (!context) {
    throw new Error('useCurrentDate must be used within a CurrentDateProvider');
  }
  return context;
};

export const useCurrentCliente = (): CurrentClienteContextProps => {
  const context = useContext(CurrentClienteContext);
  if (!context) {
    throw new Error("useCurrentCliente must be used within a ContextProvider");
  }
  return context;
};

export const useCurrentAdminOrUser = (): CurrentAdminOrUserProps => {
  const context = useContext(CurrentAdminOrUserContext);
  if (!context) {
    throw new Error("useCurrentCliente must be used within a ContextProvider");
  }
  return context;
};


export const useFuncionarioContext = (): FuncionarioContextProps => {
  const context = useContext(FuncionarioContext);
  if (!context) {
    throw new Error("useCurrentCliente must be used within a ContextProvider");
  }
  return context;
};
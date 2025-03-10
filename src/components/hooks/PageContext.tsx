"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { addDays } from 'date-fns';

interface UserDataProps {
  nome: string
  role: string
  email: string
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
  setNome: (nome: string) => void
  setEmail: (email: string) => void
  setRole: (role: string) => void
  getToken: () => string | null
  getUserData: () => UserDataProps | null
  saveToken: (token: string) => void
  Logout: () => void
}

const CurrentDateContext = createContext<CurrentDateContextProps | undefined>(undefined);
const CurrentClienteContext = createContext<CurrentClienteContextProps | undefined>(undefined);
const CurrentAdminOrUserContext = createContext<CurrentAdminOrUserProps | undefined>(undefined);


export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [cliente, setClienteState] = useState('')
  const [role, setRoleState] = useState('')
  const [email, setEmailState] = useState('')
  const [nome, setNomeState] = useState('')

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
    return sessionStorage.getItem('token')
  }

  const setRole = (role: string) => {
    setRoleState(role)
  }

  const Logout = () => {
    sessionStorage.clear()
    localStorage.removeItem('user')
  }

  return (
    <CurrentDateContext.Provider value={{ currentDate, setCurrentDate, changeWeek }}>
      <CurrentClienteContext.Provider value={{ cliente, role, setCliente, setRole, getToken, saveToken }}>
        <CurrentAdminOrUserContext.Provider value={{role, email, nome, setEmail, setNome, setRole, getToken, saveToken, getUserData, Logout}}>
          {children}
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
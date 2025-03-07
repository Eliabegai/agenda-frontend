"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { addDays } from 'date-fns';

interface CurrentDateContextProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  changeWeek: (weeks: number) => void;
}

interface CurrentClienteContextProps {
  cliente: string
  setCliente: (nome: string) => void
  getToken: () => string | null
  saveToken: (token: string) => void
  
}

const CurrentDateContext = createContext<CurrentDateContextProps | undefined>(undefined);
const CurrentClienteContext = createContext<CurrentClienteContextProps | undefined>(undefined);


export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [cliente, setClienteState] = useState('')

  useEffect(() => {
    const storadCliente = localStorage.getItem('cliente')
    if(storadCliente) {
      setClienteState(storadCliente)
    }
  },[])

  const setCliente = (nome: string) => {
    setClienteState(nome)
    localStorage.setItem('cliente', nome)
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

  return (
    <CurrentDateContext.Provider value={{ currentDate, setCurrentDate, changeWeek }}>
      <CurrentClienteContext.Provider value={{ cliente, setCliente, getToken, saveToken }}>
        {children}
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
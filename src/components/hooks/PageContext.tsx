"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { addDays } from 'date-fns';

interface CurrentDateContextProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  changeWeek: (weeks: number) => void;
}

const CurrentDateContext = createContext<CurrentDateContextProps | undefined>(undefined);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const changeWeek = (weeks: number) => {
    setCurrentDate(addDays(currentDate, weeks * 7));
  };

  return (
    <CurrentDateContext.Provider value={{ currentDate, setCurrentDate, changeWeek }}>
      {children}
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
'use client'
import React, { ReactNode } from 'react';
import {Sidebar, SidebarCliente} from './Sidebar';
import Header from './Header';
import { useCurrentCliente } from '../hooks/PageContext';

type PaginaProps = {
  children: ReactNode;
  className?: string;
};

const Pagina = (props: PaginaProps) => {
  const {role} = useCurrentCliente()

  return (
    <div className="flex flex-col m-auto px-4 py-2 w-full h-screen absolute">
      <Header />
      <div className="flex flex-row h-screen w-full mt-4 overflow-auto">
        {role === "ADMIN" ? <Sidebar /> : <SidebarCliente />}
        <main className="flex flex-col flex-1 justify-center items-center ml-72">{props.children}</main>
      </div>
    </div>
  );
};

export default Pagina;

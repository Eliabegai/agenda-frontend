'use client'
import React, { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faUser } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../ui/button';
import { ModeToggle } from '../ModeToggle/modeToggler';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import Sidebar from './Sidebar';
import SidebarCliente from './SidebarCliente';

type PaginaProps = {
  children: ReactNode;
  className?: string;
};

const Pagina = (props: PaginaProps) => {

  return (
    <div className="flex flex-col m-auto px-4 py-2 w-full h-screen absolute">
      <header className="flex border-b-2 px-4 pt-4 pb-1 justify-between items-center">
        <div className='text-2xl flex items-center space-x-2'>
          <FontAwesomeIcon icon={faCalendarDays} color='(--background-azul)' />
          <h1 className='text-3xl font-bold'>Agenda de Trabalho</h1>
        </div>
        <div className='space-x-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <FontAwesomeIcon icon={faUser} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => alert('Editar Perfil')}>Editar Perfil</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
        </header>
      <div className="flex flex-row h-screen w-full mt-4 overflow-auto">
        {/* <Sidebar /> */}
        <SidebarCliente />
        <main className="flex flex-col flex-1 justify-center items-center ml-72">{props.children}</main>
      </div>
    </div>
  );
};

export default Pagina;

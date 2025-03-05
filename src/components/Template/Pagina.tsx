'use client';
import React, { ReactNode, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCalendarDays, faUser } from '@fortawesome/free-solid-svg-icons';
import { Calendar } from '../ui/calendar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ModeToggle } from '../ModeToggle/modeToggler';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

type PaginaProps = {
  children: ReactNode;
  className?: string;
};

const Pagina = (props: PaginaProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [funcionario, setFuncionario] = useState<string>('');
  
  const handleClick = () => {
    if(funcionario)
      alert(`Buscar Funcionario ${funcionario} no banco de dados.`)
    return
  }
  const handleClickFuncionario = () => {
    alert(`Gerenciar Funcionarios.`)
  }

  const gerarFuncionarios = () => {
    return Array.from({length: 10}, (_, id) => ({
      id: id+1,
      nome: `Funcionario ${id + 1}`
    }))
  }

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
        <aside className="flex flex-col w-72 h-full border-r border-[var(--background-azul)] p-2 items-center text-sm gap-5">
          
          <div className="flex w-full items-center justify-center">
            <Calendar mode="single" className="border w-auto h-auto shadow-lg shadow-primary/20 rounded-4xl" selected={date} onSelect={setDate} />
          </div>
          
          <div className='flex w-full justify-center items-center'>
            <Button onClick={handleClickFuncionario} className="">Gerenciar Funcionarios</Button>
          </div>
          
          <div className="flex w-64 mt-4 items-center py-2 px-3 space-x-1">
            <Input type="text" placeholder="Buscar Funcionario" value={funcionario} onChange={(e) => setFuncionario(e.target.value)} />
            <Button onClick={handleClick}><FontAwesomeIcon icon={faMagnifyingGlass} /></Button>
          </div>
          
          <div className="flex flex-col w-full gap-1 border rounded-md py-6 overflow-auto">
            <ul className="border-r border-gray-400">
              {
                gerarFuncionarios().map((i) => {
                  return(
                    <li key={i.id} className="mt-2 ml-2 border-b p-2 hover:bg-secondary">{i.nome}</li>
                  )
                })
              }
            </ul>
          </div>

        </aside>
        <main className="flex flex-col flex-1 justify-center items-center aboslute">{props.children}</main>
      </div>
    </div>
  );
};

export default Pagina;

'use client';
import React, { ReactNode, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Calendar } from '../ui/calendar';
import { Input } from '../ui/input';

type PaginaProps = {
  children: ReactNode;
  className?: string;
};

const Pagina = (props: PaginaProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [funcionario, setFuncionario] = useState<string>('');
  return (
    <div className="flex flex-col m-auto px-4 py-2 w-full h-screen">
      <header className="flex border-b-2 p-5 justify-center items-center">Header</header>
      <div className="flex flex-row h-screen w-full mt-4 overflow-auto">
        <aside className="flex flex-col w-72 h-svh border-r border-cyan-500 p-2 items-center text-sm gap-3">
          <div className="flex w-full items-center justify-center p-2">
            <Calendar mode="single" className="rounded-md border w-auto h-auto" selected={date} onSelect={setDate} />
          </div>
          <div className="flex justify-center items-center bg-cyan-500 w-64 text-center p-3 rounded-2xl">Gerenciar Funcionarios</div>
          <div className="flex flex-row-reverse w-64 items-center justify-between py-2 px-3">
            {' '}
            <Input type="text" placeholder="Buscar Funcionario" value={funcionario} onChange={(e) => setFuncionario(e.target.value)} />{' '}
            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute mr-2" />{' '}
          </div>
          <div className="flex flex-col w-full gap-1 border rounded-md py-6">
            <ul className="border-r border-gray-400">
              <li className="mt-2 border-b p-2 hover:bg-zinc-900">Funcionario 1</li>
              <li className="mt-2 border-b p-2 hover:bg-zinc-900">Funcionario 2</li>
              <li className="mt-2 border-b p-2 hover:bg-zinc-900">Funcionario 3</li>
              <li className="mt-2 border-b p-2 hover:bg-zinc-900">Funcionario 4</li>
            </ul>
          </div>
        </aside>
        <main className="flex flex-col flex-1 justify-center items-center">{props.children}</main>
      </div>
    </div>
  );
};

export default Pagina;

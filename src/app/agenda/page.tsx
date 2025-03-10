'use client'
import AgendaCliente from '@/components/Agenda/AgendaCliente';
import AgendaFuncionario from '@/components/Agenda/AgendaFuncionario';
import AgendaGeral from '@/components/Agenda/AgendaGeral';
import { useCurrentAdminOrUser } from '@/components/hooks/PageContext';
import Pagina from '@/components/Template/Pagina';

export default function Agenda() {
  const { role } = useCurrentAdminOrUser()
  return (
    <Pagina>
      <div className='flex flex-1 w-full h-full justify-center items-center p-2 relative '>
        { role === 'admin' ? <AgendaGeral /> : role === 'user' ? <AgendaFuncionario /> :<AgendaCliente /> }
      </div>
    </Pagina>
  );
}

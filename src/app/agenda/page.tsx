import AgendaGeral from '@/components/Agenda/AgendaGeral';
import Pagina from '@/components/Template/Pagina';

export default function Agenda() {
  return (
    <Pagina>
      <div className='flex flex-1 w-full h-full justify-center items-center p-2 relative '>
        <AgendaGeral />
      </div>
    </Pagina>
  );
}

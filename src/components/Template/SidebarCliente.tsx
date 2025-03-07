'use client'
import { Calendar } from '../ui/calendar';
import { useCurrentCliente, useCurrentDate } from '../hooks/PageContext';

const SidebarCliente = () => {
    const { currentDate, setCurrentDate} = useCurrentDate()
    const { cliente } = useCurrentCliente()

      const handleDateChange = (date: Date | undefined) => {
        if(date) {
          setCurrentDate(date)
        }
      }

    return(
        <aside className="flex flex-col fixed top-20 left-0 w-72 h-full border-r border-[var(--background-azul)] p-2 items-center text-sm gap-3 overflow-auto">
          
          <div className="flex w-full items-center justify-center">
            <Calendar 
                mode="single" 
                className="border w-auto h-auto shadow-lg shadow-primary/20 rounded-2xl" 
                selected={currentDate} 
                onSelect={handleDateChange} 
                onMonthChange={handleDateChange}
                month={currentDate}
                weekStartsOn={0}
            />
          </div>
            {/* Cliente ao entrar no site, solicitar o nome dele para colocar no campo Cliente, depois quando preecher o formulário, já deixar o nome dele lá preenchido. */}
          
          {
            cliente &&
            <div className='flex flex-col justify-start w-full p-2 ml-10 mt-6 space-y-4'>
                <span>Bem vindo,</span>
                <h2 className='text-lg font-semibold'>{cliente}</h2>
            </div>
          }

        </aside>
    )
}

export default SidebarCliente
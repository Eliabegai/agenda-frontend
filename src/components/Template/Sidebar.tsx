'use client'
import { useState } from 'react';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Calendar } from '../ui/calendar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCurrentDate } from '../hooks/PageContext';



const Sidebar = () => {

    const [funcionario, setFuncionario] = useState<string>('');
    const { currentDate, setCurrentDate} = useCurrentDate()

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
          
          <div className='flex w-full justify-center items-center'>
            <Button onClick={handleClickFuncionario} className="bg-[var(--background-azul)]">Gerenciar Funcionarios</Button>
          </div>
          
          <div className="flex w-64 items-center py-2 px-3 space-x-1">
            <Input type="text" placeholder="Buscar Funcionario" value={funcionario} onChange={(e) => setFuncionario(e.target.value)} />
            <Button onClick={handleClick} className="bg-[var(--background-azul)]" ><FontAwesomeIcon icon={faMagnifyingGlass} /></Button>
          </div>
          
          <div className="flex flex-col w-full gap-1 border rounded-md py-6 mb-2 overflow-auto">
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
    )
}

export default Sidebar
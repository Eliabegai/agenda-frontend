"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { format, addDays, setMonth, subDays, startOfWeek, startOfMonth, endOfMonth, differenceInCalendarWeeks } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { useCurrentDate } from '../hooks/PageContext';
import { toast } from 'sonner';

const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

const agendamentosMock = [
  [0, 2, 6, 2, 3, 2, 0], // 07:00
  [0, 0, 0, 0, 1, 0, 0], // 07:30
  [0, 2, 6, 2, 6, 2, 6], // 08:00
  [0, 0, 0, 6, 1, 6, 5], // 08:30
  [0, 3, 6, 2, 3, 2, 4], // 09:00
  [0, 0, 0, 0, 1, 3, 5], // 09:30
  [0, 2, 6, 2, 3, 6, 6], // 10:00
  [0, 0, 0, 6, 1, 6, 6], // 10:30
  [0, 2, 6, 6, 3, 2, 0], // 11:00
  [0, 0, 0, 3, 6, 0, 4], // 11:30
  [0, 2, 6, 2, 3, 2, 6], // 12:00
  [0, 4, 2, 0, 1, 6, 0], // 12:30
  [0, 2, 6, 2, 3, 2, 0], // 13:00
  [0, 0, 0, 6, 1, 6, 7], // 13:30
  [0, 2, 6, 2, 3, 2, 0], // 14:00
  [0, 6, 0, 6, 1, 0, 3], // 14:30
  [0, 0, 0, 6, 1, 0, 0], // 15:00
  [0, 6, 6, 6, 1, 0, 2], // 15:30
  [0, 0, 0, 5, 1, 0, 0], // 16:00
  [0, 0, 6, 0, 1, 0, 0], // 16:30
  [0, 0, 0, 0, 1, 0, 0], // 17:00
  [0, 0, 0, 3, 1, 0, 6], // 17:30
  [0, 0, 0, 0, 1, 0, 0], // 18:00
  [0, 2, 0, 0, 1, 0, 0], // 18:30
  [0, 0, 0, 0, 1, 0, 8], // 19:00
  [0, 7, 3, 3, 1, 0, 0], // 19:30
  [0, 0, 0, 0, 1, 0, 0], // 20:00
];
interface DateInfo {
    dayOfWeek: string;
    dayOfMonth: string;
    dayOfMonthNumber: number;
    month: string;
}

export default function AgendaGeral() {
    const { currentDate, changeWeek} = useCurrentDate()
    const [dates, setDates] = useState<DateInfo[]>([])
    const [mesAtual, setMesAtual] = useState('')
    const [horarios, setHorarios] = useState<string[]>([])

    const gerarHorarios = (horaInicio:string, horaFim:string, intervalo:number) => {
        const horarios = [];
        
        // Converte as horas para minutos desde a meia-noite
        const [horaInicioH, minutoInicio] = horaInicio.split(":").map(Number);
        const [horaFimH, minutoFim] = horaFim.split(":").map(Number);
      
        let tempoInicio = horaInicioH * 60 + minutoInicio;
        const tempoFim = horaFimH * 60 + minutoFim;
      
        while (tempoInicio <= tempoFim) {
          // Converte minutos para o formato HH:mm
          const horaFormatada = String(Math.floor(tempoInicio / 60)).padStart(2, "0");
          const minutoFormatado = String(tempoInicio % 60).padStart(2, "0");
          horarios.push(`${horaFormatada}:${minutoFormatado}`);
      
          tempoInicio += intervalo;
        }

        setHorarios(horarios)
    };
    useEffect(()=>{
        const startDate = startOfWeek(currentDate, { weekStartsOn: 0 })
        
        const nextSevenDays = Array.from({length: 7}, (_, i) => {
            const newDate = addDays(startDate, i)
            return{
                dayOfWeek: daysOfWeek[newDate.getDay()],
                dayOfMonth: format(newDate, "d"),
                month: format(newDate, "MMMM", { locale: ptBR }),
                dayOfMonthNumber: newDate.getDay(),
            }
        })
        
        setMesAtual(format(currentDate, "MMMM", { locale: ptBR }))
        setDates(nextSevenDays) 
        gerarHorarios("07:00", "20:00", 30)
    },[currentDate])

    return (
        <div className="flex flex-col w-full p-4 rounded-xl shadow-md left-0 top-0 absolute">
            <div className="flex justify-end items-center space-x-2 px-2 sticky top-0 z-10 bg-primary-foreground">
                <Button variant="ghost" onClick={() => changeWeek(-1)}><ChevronLeft /></Button>
                <h2 className="text-lg font-bold capitalize">{mesAtual}</h2>
                <Button variant="ghost" onClick={() => changeWeek(1)}><ChevronRight /></Button>
            </div>

            <div className="flex flex-col h-full">
                <table className="w-full border-separate border-spacing-1 p-2 items-center">
                    <thead className='sticky top-9 z-10 bg-primary-foreground'>
                        <tr>
                        {dates.map((dia, i) => (
                            <th key={i} className={`
                                text-center rounded-md
                                ${dia.dayOfWeek === "Dom" ? "opacity-30" : "opacity-100"}
                                ${+dia.dayOfMonth === currentDate.getDate() ? "dark:bg-zinc-800 font-bold bg-gradient-to-tl from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700" : "font-normal"}
                            `}>
                                <div className={`flex flex-col w-auto justify-center items-center`}>
                                    <span className='capitalize'>{dia.dayOfWeek}</span>
                                    <span>{dia.dayOfMonth}</span>
                                </div>
                            </th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>
                        { horarios.map((hora, i) => (
                            <tr key={i}>
                                {dates.map((dia, j) => (
                                    <td key={j} className={`
                                        text-center border p-2 rounded-lg font-normal hover:bg-primary-foreground
                                        ${dia.dayOfWeek === "Dom" ? "opacity-30" : "opacity-100"}
                                        ${agendamentosMock?.[i]?.[j] > 4 ? "bg-red-300 hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600" : ""}
                                    `}>
                                        <div  className='flex flex-row w-full justify-between items-center space-x-2'>
                                            <div className='flex flex-col text-xs'>
                                                <span>{hora}</span>
                                                <span>Agendados</span>
                                            </div>
                                            {
                                                (dia.dayOfWeek === "domingo") ? (
                                                    <span className='text-xl font-normal'>-------</span>
                                                ) : (
                                                    <>
                                                        <span className='font-normal'>{dia.dayOfWeek === "Dom" ? "---" : agendamentosMock?.[i]?.[dia.dayOfMonthNumber]}</span>
                                                        <Button 
                                                            disabled={dia.dayOfWeek === "Dom" || agendamentosMock?.[i]?.[j] > 4} 
                                                            size={'icon'} 
                                                            onClick={() => toast.info(`Agendado: ${hora}`)}
                                                            className='bg-zinc-700 hover:bg-zinc-600 dark:bg-zinc-300 dark:hover:bg-zinc-200'
                                                        >
                                                            <Pencil size={12} />
                                                        </Button>
                                                    </>
                                                )
                                            }
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

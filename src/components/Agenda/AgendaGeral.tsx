"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { format, addDays, setMonth } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const horariosAntes = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"];



const agendamentosMock = [
  [0, 2, 6, 2, 3, 2, 0], // 07:00
  [0, 0, 0, 0, 1, 0, 0], // 07:30
  [0, 2, 6, 2, 3, 2, 0], // 08:00
  [0, 0, 0, 0, 1, 0, 0], // 08:30
  [0, 3, 6, 2, 3, 2, 0], // 09:00
  [0, 0, 0, 0, 1, 0, 0], // 09:30
  [0, 2, 6, 2, 3, 2, 0], // 10:00
  [0, 0, 0, 0, 1, 0, 0], // 10:30
  [0, 2, 6, 2, 3, 2, 0], // 11:00
  [0, 0, 0, 0, 1, 0, 0], // 11:30
  [0, 2, 6, 2, 3, 2, 0], // 12:00
  [0, 0, 0, 0, 1, 0, 0], // 12:30
  [0, 2, 6, 2, 3, 2, 0], // 13:00
  [0, 0, 0, 0, 1, 0, 0], // 13:30
  [0, 2, 6, 2, 3, 2, 0], // 14:00
  [0, 0, 0, 0, 1, 0, 0], // 14:30
  [0, 0, 0, 0, 1, 0, 0], // 15:00
  [0, 0, 0, 0, 1, 0, 0], // 15:30
  [0, 0, 0, 0, 1, 0, 0], // 16:00
  [0, 0, 0, 0, 1, 0, 0], // 16:30
  [0, 0, 0, 0, 1, 0, 0], // 17:00
  [0, 0, 0, 0, 1, 0, 0], // 17:30
  [0, 0, 0, 0, 1, 0, 0], // 18:00
  [0, 0, 0, 0, 1, 0, 0], // 18:30
  [0, 0, 0, 0, 1, 0, 0], // 19:00
  [0, 0, 0, 0, 1, 0, 0], // 19:30
  [0, 0, 0, 0, 1, 0, 0], // 20:00
];


interface DateInfo {
    dayOfWeek: string;
    dayOfMonth: string;
    month: string;
  }


export default function AgendaGeral() {
    const [semana, setSemana] = useState(0); // Para navegar entre semanas
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
      
          // Incrementa o tempo pelo intervalo
          tempoInicio += intervalo;
        }

        setHorarios(horarios)
    };
    
    useEffect(()=>{
        const today = new Date()
        const startDate = addDays(today, semana * 7)
        
        const nextSevenDays = Array.from({length: 7}, (_, i) => {
            const newDate = addDays(startDate, i)
            return{
                dayOfWeek: daysOfWeek[newDate.getDay()],
                dayOfMonth: format(newDate, "d"),
                month: format(newDate, "MMMM", { locale: ptBR }),
            }
        })
        
        setMesAtual(format(today, "MMMM", { locale: ptBR }))
        setDates(nextSevenDays) 
        gerarHorarios("07:00", "20:00", 30)
    },[])
    return (
        <div className="flex flex-col w-full p-4 rounded-xl shadow-md left-0 top-0 absolute">
        {/* Cabeçalho */}
        <div className="flex justify-end items-center mb-4 space-x-2">
            <Button variant="ghost" onClick={() => setSemana(semana - 1)}>
            <ChevronLeft />
            </Button>
            <h2 className="text-lg font-bold capitalize">{mesAtual}</h2>
            <Button variant="ghost" onClick={() => setSemana(semana + 1)}>
            <ChevronRight />
            </Button>
        </div>

        <div className="flex flex-col h-full">

            <table className="w-full border-collapse p-2 gap-2">
                <thead>
                    <tr>
                    {dates.map((dia, i) => (
                        <th key={i} className={`text-center ${dia.dayOfWeek === "Dom" ? "opacity-30" : "opacity-100"}`}>
                        <span className='capitalize'>{dia.dayOfWeek}</span> <br />
                        <span className="">{dia.dayOfMonth}</span>
                        </th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    { horarios.map((hora, i) => (
                        <tr key={i}>
                            {dates.map((dia, j) => (
                                <td key={j} className={`text-center border p-2 rounded-lg font-normal hover:bg-primary-foreground ${dia.dayOfWeek === "Dom" ? "opacity-30" : "opacity-100"}`}>
                                    <div  className='flex flex-row w-full justify-between items-center space-x-2'>
                                        <div className='flex flex-col text-xs'>
                                            <span className="">{hora}</span>
                                            <span className="">Agendados</span>
                                        </div>
                                        {
                                            (dia.dayOfWeek === "domingo") ? (
                                                <span className='text-xl font-normal'>-------</span>
                                            ) : (
                                                <>
                                                    <span className='font-normal'>{dia.dayOfWeek === "Dom" ? "---" : agendamentosMock?.[i]?.[j]}</span>
                                                    <Button disabled={dia.dayOfWeek === "Dom"} size={'icon'} onClick={() => alert(`Click: ${hora}`)}>
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

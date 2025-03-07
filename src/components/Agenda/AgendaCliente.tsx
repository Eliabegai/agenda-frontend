"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { format, addDays, setMonth, subDays, startOfWeek, startOfMonth, endOfMonth, differenceInCalendarWeeks } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { useCurrentCliente, useCurrentDate } from '../hooks/PageContext';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import AlertaDialog from '../Alerta/AlertaDialog';
import FormularioAgenda from './FormularioAgenda';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

const agendamentosMock = [
    [0, 2, 6, 2, 3, 2, 0], // 07:00
    [0, 6, 0, 0, 1, 0, 0], // 07:30
    [0, 2, 6, 2, 6, 2, 6], // 08:00
    [0, 0, 0, 6, 1, 6, 5], // 08:30
    [0, 6, 6, 2, 3, 2, 4], // 09:00
    [0, 6, 0, 0, 1, 3, 5], // 09:30
    [0, 2, 6, 2, 3, 6, 6], // 10:00
    [0, 6, 0, 6, 1, 6, 6], // 10:30
    [0, 6, 6, 6, 3, 2, 0], // 11:00
    [0, 0, 0, 3, 6, 0, 4], // 11:30
    [0, 6, 6, 2, 3, 2, 6], // 12:00
    [0, 4, 2, 0, 1, 6, 0], // 12:30
    [0, 2, 6, 2, 3, 2, 0], // 13:00
    [0, 6, 0, 6, 1, 6, 7], // 13:30
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

export const FormSchema = z.object({
  nome: z.string({message: "Campo obrigatório"}),
  telefone: z.string().min(11,{message: "Mínimo 11 caracteres"}),
  email: z.string().email({ message: "Invalid email address" }),
  data: z.string().min(10,{message: "Data inválida"}).optional(),
  horario: z.string().min(5,{message: "Horário inválido"}).optional(),
  protocolo: z.string().min(6,{message: "Protocolo inválido"})
})

export default function AgendaCliente() {
  const { currentDate, changeWeek} = useCurrentDate()
  const { setCliente } = useCurrentCliente()
  const [dates, setDates] = useState<DateInfo[]>([])
  const [mesAtual, setMesAtual] = useState('')
  const [horarios, setHorarios] = useState<string[]>([])
  const [openDialong, setOpenDialog] = useState(false)
  const [nome, setNome] = useState('')
  const [openForm, setOpenForm] = useState(false)
  const [horaAgendamento, setHoraAgendamento] = useState<string[]>([])

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
    
    setTimeout(() => {
      const storadCliente = localStorage.getItem('cliente')

      if(!storadCliente)
        setOpenDialog(!openDialong)
    }, 3000)
    
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

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nome: '',
      telefone: '',
      email: '',
      data: '',
      horario: '',
      protocolo: ''
    }
  })
  const errors = form.formState.errors


  const handleClickDialog = () => {
    setCliente(nome)
    setOpenDialog(!openDialong)
  }

  const handleClickForm = (hora: string, day: string, month: number) => {
    const year = new Date().getFullYear()
    const agendamento = [hora, `${year}-${month+1}-${day}`]
    setHoraAgendamento(agendamento)
    setOpenForm(!openForm)
  }

  const getHourAndDate = () => {
    if(horaAgendamento.length === 0) return ""
    const [hora, minuto] = horaAgendamento[0]?.split(':').map(Number)
    const [ano, mes, dia] = horaAgendamento[1]?.split('-').map(Number)

    const dataHora = new Date(Date.UTC(ano, mes-1, dia, hora+3, minuto))
    
    return dataHora.toISOString()
  }
  
  const handleSubmit = (data: z.infer<typeof FormSchema>) => {
    const newdata = form.getValues()
    console.log(newdata)

    toast.success('Agendado com sucesso!')
    setOpenForm(false)
  }

  return (
    <div className="flex flex-col w-full p-4 rounded-xl shadow-md left-0 top-0 absolute">
      <div className="flex justify-end items-center space-x-2 px-2 sticky top-0 z-10 bg-primary-foreground">
        <Button variant="ghost" onClick={() => changeWeek(-1)}><ChevronLeft /></Button>
        <h2 className="text-lg font-bold capitalize">{mesAtual}</h2>
        <Button variant="ghost" onClick={() => changeWeek(1)}><ChevronRight /></Button>
      </div>
      <AlertaDialog open={openDialong} setOpen={setOpenDialog} title='Qual o seu nome?' action={handleClickDialog} cancel={() => setOpenDialog(!openDialong)}>
        <Input className='text-zinc-800 dark:text-zinc-300' value={nome} placeholder='Seu nome' onChange={(e) => setNome(e.target.value)} type='text' />
      </AlertaDialog>

      <AlertaDialog 
        open={openForm} 
        setOpen={setOpenForm}
      >
        <FormularioAgenda 
          form={form} 
          onSubmit={handleSubmit} 
          date={getHourAndDate()}
          horario={horaAgendamento[0]}
          cancel={() => setOpenForm(!openForm)}
        />
      </AlertaDialog>

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
                        ${(agendamentosMock?.[i]?.[j] > 0) && (agendamentosMock?.[i]?.[j] < 4) ? "bg-green-300 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-700" : "opacity-30"}
                    `}>
                      <div  className='flex flex-row w-full justify-between items-center space-x-2'>
                        <div className='flex flex-col text-lg'>
                          <span>{hora}</span>
                        </div>
                        {
                          (dia.dayOfWeek === "domingo") ? (
                            <span className='text-xl font-normal'>-------</span>
                          ) : (
                            <>
                              <span className='font-normal'>{dia.dayOfWeek === "Dom" ? "---" : ""}</span>
                              <Button 
                                disabled={dia.dayOfWeek === "Dom" || (agendamentosMock?.[i]?.[j] > 0) && (agendamentosMock?.[i]?.[j] < 4)} 
                                size={'icon'} 
                                onClick={() => handleClickForm(hora, dia.dayOfMonth, dia.dayOfMonthNumber)}
                                className='bg-zinc-700 dark:bg-zinc-300 dark:hover:bg-zinc-200'
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

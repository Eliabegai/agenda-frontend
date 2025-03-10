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
import { agendamentosMockGeral } from './agendamentosMock';

const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

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
  
  const handleSubmit = () => {
    const newdata = form.getValues()

    toast.success('Agendamento realizado com sucesso!',{
      description: (
        <span>Você receberá um e-mail de confirmação.</span>
      ),
      duration: 5000,
      position: 'top-right',
    })
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
                    <td 
                      key={j} 
                      data-inative={dia.dayOfWeek === "Dom"}
                      data-inativeDay={(agendamentosMockGeral?.[i]?.[j] > 0) && (agendamentosMockGeral?.[i]?.[j] < 4)}
                      className={`
                        text-center border p-2 rounded-lg font-normal hover:bg-primary-foreground
                        data-[inative=true]:opacity-30
                        data-[inativeDay=true]:bg-green-400 data-[inativeDay=true]:hover:bg-green-500
                        data-[inativeDay=true]:dark:bg-green-700 data-[inativeDay=true]:dark:hover:bg-green-600
                        data-[inativeDay=false]:opacity-30 data-[inativeDay=false]:bg-zinc-100 data-[inativeDay=false]:dark:bg-zinc-800
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
                                disabled={dia.dayOfWeek === "Dom" ||  (agendamentosMockGeral?.[i]?.[j] === 0) || (agendamentosMockGeral?.[i]?.[j] > 3)} 
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

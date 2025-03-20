"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { format, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { useCurrentCliente, useCurrentDate } from '../hooks/PageContext';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import AlertaDialog from '../Alerta/AlertaDialog';
import FormularioAgenda from './FormularioAgenda';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { gerarHorarios, returnNextSevenDays } from '@/utils/gerarHorarios';
import { Dialog, DialogContent, DialogDescription } from '../ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useAppointments } from '../hooks/use-appointments';
import AppointmentDetails from './appointment-details';
import { Badge } from '../ui/badge';

interface DateInfo {
  dayOfWeek: string;
  dayOfMonth: string;
  dayOfMonthNumber: number;
  month: string;
  fullDate: string
}

export const FormSchema = z.object({
  dataHora: z.date(),
  Cliente: z.object({
      nome: z.string({message: "Campo obrigatório"}),
      telefone: z.string().min(11,{message: "Mínimo 11 caracteres"}),
      email: z.string().email({ message: "Invalid email address" }),
      protocolo: z.string().min(6,{message: "Protocolo inválido"})
    })
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
  const [horaAgendamento, setHoraAgendamento] = useState<string>('')
  const [agendamentosPorHorario, setAgendamentosPorHorario] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(false)

  const { appointments, lastAppointment, saveAppointment, setLastAppointment } = useAppointments()
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false)

  const url = process.env.NEXT_PUBLIC_API_URL

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      Cliente: {
        nome: '',
        telefone: '',
        email: '',
        protocolo: ''
      },
    }
  })

  const agruparAgendamentosPorHorario = (agendamentos: IAgendamento[]) => {
    const agendamentosAgrupados: { [key: string]: number } = {};

    agendamentos?.forEach(agendamento => {
      const dataHora = new Date(agendamento.dataHora);
      const dia = format(dataHora, 'yyyy-MM-dd');
      const hora = format(dataHora, 'HH:mm');

      const chave = `${dia} ${hora}`;
      if (!agendamentosAgrupados[chave]) {
          agendamentosAgrupados[chave] = 0;
      }
      agendamentosAgrupados[chave]++;
    });

    setAgendamentosPorHorario(agendamentosAgrupados);
  };

  const handleClickDialog = () => {
    setCliente(nome)
    setOpenDialog(!openDialong)
  }

  const handleClickForm = (hora: string, date: string) => {
    const agendamento = `${date}T${hora}:00`
    setHoraAgendamento(agendamento)
    setOpenForm(!openForm)
  }

  const getHourAndDate = () => {
    if(horaAgendamento.length === 0) return null
    

    const [hora, minuto] = horaAgendamento[0]?.split(':').map(Number)
    const [ano, mes, dia] = horaAgendamento[1]?.split('-').map(Number)
    
    return new Date(Date.UTC(ano, mes - 1, dia, hora + 3, minuto));
  }
  

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true)

    try {
      const response = await fetch(`${url}/agendamento`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      })

      if(!response.ok) {
        const errorData = await response.json()
        toast.error('Erro ao Cadastrar Reunião', {
          description: (
          <span>{errorData.message || errorData.error}</span>
          )
        })
        throw new Error(errorData.message || errorData.error || 'Erro ao realizar o agendamento. Tente novamente mais tarde.')
      }

      const appointmentData = await response.json()
      
      saveAppointment(appointmentData)

      agruparAgendamentosPorHorario([appointmentData])


      toast.success('Agendamento realizado com sucesso!',{
        description: (
          <div>
            <span>Agendamento Confirmado.</span>
            <Button variant={'outline'} onClick={() => setShowAppointmentDetails(!showAppointmentDetails)}>Detalhes</Button>

          </div>
        ),
        duration: 10000,
      })
      
    } catch (error) {
      console.error('Erro ao Cadastrar Reunião', error)
    } finally {
      setOpenForm(false)
      setLoading(false)
    }

  }

  useEffect(()=>{
    const startDate = startOfWeek(currentDate, { weekStartsOn: 0 })
    
    setTimeout(() => {
      const storadCliente = localStorage.getItem('cliente')
      if(!storadCliente)
        setOpenDialog(!openDialong)
    }, 3000)
    
    const nextSevenDays = returnNextSevenDays(startDate)
    setDates(nextSevenDays)
    
    setMesAtual(format(currentDate, "MMMM", { locale: ptBR }))
    
    const horarios = gerarHorarios("07:00", "20:00", 30)
    setHorarios(horarios)
  },[currentDate])


  useEffect(() => {
    agruparAgendamentosPorHorario(appointments);
  }, [appointments]);
  
  console.log('agendamentosPorHorario', agendamentosPorHorario)
  
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

      <Dialog open={openForm} onOpenChange={setOpenForm} >
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
        <DialogContent>
          <FormularioAgenda 
            form={form} 
            onSubmit={handleSubmit} 
            date={getHourAndDate()}
            horaAgendamento={horaAgendamento}
            cancel={() => setOpenForm(!openForm)}
            loading={loading}
          />
        </DialogContent>
      </Dialog>

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
                  { dates.map((dia, j) => {
                      const appointmentKey = `${dia.fullDate} ${hora}`
                      const hasAppointments = agendamentosPorHorario[appointmentKey] > 0
                      const appointmentCount = agendamentosPorHorario[appointmentKey] || 0

                      return (
                        <td
                          key={j}
                          className={`
                            text-center border p-2 rounded-lg font-normal hover:bg-primary-foreground
                            ${dia.dayOfWeek === "Dom" ? " bg-zinc-200 opacity-30" : "opacity-100"}
                            ${hasAppointments ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : ""}
                        `}
                        >
                          <div className='flex flex-row w-full justify-between items-center space-x-2'>
                              <div className='flex flex-col text-xs'>
                                <span>{hora}</span>
                                <span className="flex items-center">
                                  {hasAppointments && (
                                    <span className="inline-flex items-center justify-center w-5 h-5 mr-1 text-xs font-semibold text-white bg-green-500 rounded-full">
                                      {appointmentCount}
                                    </span>
                                  )}
                                  Agendados
                                </span>
                              </div>
                              {
                                (dia.dayOfWeek === "domingo") ? (
                                  <span className='text-xl font-normal'>---</span>
                                ) : (
                                  <>
                                    <span className='font-normal'>{dia.dayOfWeek === "Dom" ? "---" : ""}</span>
                                    <Button
                                      disabled={dia.dayOfWeek === "Dom"}
                                      size={'icon'}
                                      onClick={() => handleClickForm(hora, dia.fullDate)}
                                      className={`
                                        g-zinc-700 hover:bg-zinc-600 dark:bg-zinc-300 dark:hover:bg-zinc
                                        ${ hasAppointments ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                                          : "bg-zinc-700 hover:bg-zinc-600 dark:bg-zinc-300 dark:hover:bg-zinc-200" }
                                      `}
                                    >
                                      <Pencil size={12} />
                                    </Button>
                                  </>
                                )
                              }
                          </div>
                        </td>
                      )
                    })
                  }
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        { showAppointmentDetails && lastAppointment && (
          <AppointmentDetails appointment={lastAppointment} open={showAppointmentDetails} onClose={() => setShowAppointmentDetails(false)} />
        )}

        { appointments && !showAppointmentDetails && (
          <div className='flex flex-col w-full'>
            <h3 className="text-lg font-bold">Agendamentos:</h3>
            <div className='flex flex-wrap truncate w-full max-h-72 justify-center items-center overflow-auto space-x-2'>
              {
                appointments.map((agenda, index) => (
                  <div className="mt-4 p-4 w-80 gap-3 border rounded-lg bg-primary-foreground" key={index}>
                    
                    <div className="flex flex-col gap-2">
                      <div className='flex space-x-2 items-center'>
                        <span className="text-sm font-medium">Protocolo: <Badge variant={'outline'}>{agenda.protocolo?.codigo}</Badge></span>
                        <span className="text-sm font-medium">Status: <Badge>{agenda.status}</Badge></span>
                      </div>
                      <div className='flex gap-2 items-center'>
                        <span className="text-sm font-medium">Data/Hora:</span>
                        <span className="font-normal">{new Date(agenda.dataHora).toLocaleString("pt-BR")}</span>
                      </div>
                    </div>
                    <div className="flex items-center mt-2 w-full">
                      <Button variant="outline" size="sm" className='w-full' onClick={() => {setLastAppointment(agenda), setShowAppointmentDetails(true)}}>
                        Ver detalhes
                      </Button>
                    </div>

                  </div>
                ))
              }
            </div>
          </div>
        )}
    </div>
  );
}

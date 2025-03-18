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

  const [agendamentos, setAgendamentos] = useState<IAgendamento[]>([]);

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

  const getAgendamentos = async () => {

    const startDate = `${dates?.[0]?.fullDate}T10:00:00Z`
    const endDate = `${dates?.[6]?.fullDate}T10:00:00Z`

    try {
      const response = await fetch(`${url}/agendamento/filter?start=${startDate}&end=${endDate}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      })
      if(!response.ok) {
        const errorData = await response.json()
        toast.error('Erro ao Cadastrar Reunião', {
          description: (
          <span>{errorData.message || errorData.error}</span>
          )
        })
        throw new Error(errorData.message || errorData.error || 'Tente novamente mais tarde.')
      }
      const data = await response.json()
      setAgendamentos(data.data)
      toast.success('Agenda atualizada')
    } catch (error) {
      console.error('Erro ao buscar os dados', error)
      toast.error('Erro ao buscar os dados')
    }
  }

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

      toast.success('Agendamento realizado com sucesso!',{
        description: (
          <span>Você receberá um e-mail de confirmação.</span>
        ),
        duration: 5000,
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
    agruparAgendamentosPorHorario(agendamentos);
  }, [agendamentos]);

  
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

      <Dialog 
        open={openForm} 
        onOpenChange={setOpenForm}
      >
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
                  {
                    dates.map((dia, j) => {

                      return (
                        <td
                          key={j}
                          className={`
                            text-center border p-2 rounded-lg font-normal hover:bg-primary-foreground
                            ${dia.dayOfWeek === "Dom" ? " bg-zinc-200 opacity-30" : "opacity-100"}
                        `}
                        >
                          <div className='flex flex-row w-full justify-between items-center space-x-2'>
                              <div className='flex flex-col text-xs'>
                                <span>{hora}</span>
                                <span>Agendados</span>
                              </div>
                              {
                                (dia.dayOfWeek === "domingo") ? (
                                  <span className='text-xl font-normal'>-------</span>
                                ) : (
                                  <>
                                    <span className='font-normal'>{dia.dayOfWeek === "Dom" ? "---" : ""}</span>
                                    <Button
                                      disabled={dia.dayOfWeek === "Dom"}
                                      size={'icon'}
                                      onClick={() => handleClickForm(hora, dia.fullDate)}
                                      className='bg-zinc-700 hover:bg-zinc-600 dark:bg-zinc-300 dark:hover:bg-zinc-200'
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
    </div>
  );
}

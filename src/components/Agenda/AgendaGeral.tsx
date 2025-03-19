"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye, XIcon } from "lucide-react";
import { format, startOfWeek, addHours} from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { useCurrentAdminOrUser, useCurrentDate } from '../hooks/PageContext';
import { toast } from 'sonner';
import { Modal } from '../Dialog/Modal';
import VisualizarAgenda from './VisualizaraAgenda';
import { gerarHorarios, returnNextSevenDays } from '@/utils/gerarHorarios';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

const fullScreenDialogVariants = cva(`
    fixed inset-0 z-50 
    flex flex-col bg-background shadow-lg animate-in
    data-[state=open]:animate-in 
    data-[state=closed]:animate-out 
    data-[state=closed]:fade-out-0 
    data-[state=open]:fade-in-0
  `,
  {
    variants: {
      position: {
        default: "data-[state=open]:slide-in-from-bottom-full",
        top: "data-[state=open]:slide-in-from-top-full",
      },
    },
    defaultVariants: {
      position: "default",
    },
  },
)

interface DateInfo {
  dayOfWeek: string;
  dayOfMonth: string;
  dayOfMonthNumber: number;
  month: string;
  fullDate: string
}

export default function AgendaGeral() {
  const { currentDate, changeWeek} = useCurrentDate()
  const { email, getToken, funcionarios } = useCurrentAdminOrUser()
  const [dates, setDates] = useState<DateInfo[]>([])
  const [mesAtual, setMesAtual] = useState('')
  const [horarios, setHorarios] = useState<string[]>([])
  const [agendamentos, setAgendamentos] = useState<IAgendamento[]>([]);
  const [agendamentosPorHorario, setAgendamentosPorHorario] = useState<{ [key: string]: number }>({});
  const [openForm, setOpenForm] = useState(false)
  const [agendamentosFiltrados, setAgendamentosFiltrados] = useState<IAgendamento[]>([]);
  const [countFuncionarios, setCountFuncionarios] = useState(10)

  const url = process.env.NEXT_PUBLIC_API_URL
  const token = getToken()

  const getAgendamentos = async () => {
    if (!token) {
      toast.error('Token não encontrado');
      return;
    }
    
    if(!dates.length) {
      return;
    }

    const startDate = `${dates?.[0]?.fullDate}T00:00:00Z`
    const endDate = `${dates?.[6]?.fullDate}T23:00:00Z`

    try {
      const response = await fetch(`${url}/agendamento/filter?start=${startDate}&end=${endDate}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          'token': token,
          'admin': email
        }
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
      const data = await response.json()
      setAgendamentos(data.data)
      toast.success('Agenda atualizada')
    } catch (error) {
      console.error('Erro ao buscar os dados', error)
      toast.error('Erro ao buscar os dados')
    }
  }

  const getAgendamentosPorDataHora = async (dataHora: string) => {

    if (!token) {
      toast.error('Token não encontrado');
      return;
    }

    const startDate = addHours(format(new Date(dataHora), "yyyy-MM-dd'T'HH:mm:ss'Z'", { locale: ptBR }), 3)
    const endDate = startDate
    try {
      const response = await fetch(`${url}/agendamento/filter?start=${startDate}&end=${endDate}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          'token': token,
          'admin': email
        },
      })
      const data = await response.json()
      setAgendamentosFiltrados(data.data)
    } catch (error) {
      console.error('Erro ao buscar os dados', error)
      toast.error('Erro ao buscar os dados')
    }

  };

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

  useEffect(()=>{
    const startDate = startOfWeek(currentDate, { weekStartsOn: 0 })
    
    const nextSevenDays = returnNextSevenDays(startDate)
    setDates(nextSevenDays) 
    
    setMesAtual(format(currentDate, "MMMM", { locale: ptBR }))
    
    const horarios = gerarHorarios("07:00", "20:00", 30)
    setHorarios(horarios)
    
  },[currentDate])

  useEffect(() => {
    agruparAgendamentosPorHorario(agendamentos);
  }, [agendamentos]);

  useEffect(() => {
    getAgendamentos()
    setCountFuncionarios(funcionarios.length || 10)
  }, [dates]);

  const handleVieweAgendamento = (hora: string, quantidadeAgendamentos: number, dataHora: string) => {
    toast.info(`${quantidadeAgendamentos} - ${hora}`)
    getAgendamentosPorDataHora(dataHora)
    setOpenForm(!openForm)
  }

  return (
    <div className="flex flex-col w-full p-4 rounded-xl shadow-md left-0 top-0 absolute">
      <div className="flex justify-end items-center space-x-2 px-2 sticky top-0 z-10 bg-primary-foreground">
        <Button variant="ghost" onClick={() => changeWeek(-1)}><ChevronLeft /></Button>
        <h2 className="text-lg font-bold capitalize">{mesAtual}</h2>
        <Button variant="ghost" onClick={() => changeWeek(1)}><ChevronRight /></Button>
      </div>

      <div>
        <Dialog open={openForm} onOpenChange={() => setOpenForm(!openForm)}>
          <DialogContent className='sm:max-w-lg md:max-w-xl lg:max-w-4xl xl:max-w-[90%] max-h-[90%] truncate overflow-auto'> 
          <DialogHeader className='sticky z-10 top-0 flex flex-row justify-between'>
            <DialogTitle>Visualizar Agenda</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'></DialogDescription>
          <div className='flex w-full h-full justify-center items-center pb-6 overflow-auto truncate'>
            <ScrollArea>
              <VisualizarAgenda agendamentos={agendamentosFiltrados} updateAgendamento={getAgendamentosPorDataHora} />
            </ScrollArea>
          </div>
          </DialogContent>
        </Dialog>
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
                  { dates &&
                    dates.map((dia, j) => {
                      const chave = `${dia.fullDate} ${hora}`
                      const quantidadeAgendamentos = agendamentosPorHorario[chave] || 0

                      return (
                        <td
                          key={j}
                          className={`
                            text-center border p-2 rounded-lg font-normal hover:bg-primary-foreground
                            ${dia.dayOfWeek === "Dom" ? " bg-zinc-200 opacity-30" : "opacity-100"}
                            ${quantidadeAgendamentos > 0 ? "bg-blue-300 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600" : ""}
                            ${dates && quantidadeAgendamentos === countFuncionarios ? "bg-red-300 hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600" : ""}
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
                                    <span className='font-normal'>{dia.dayOfWeek === "Dom" ? "---" : <span className='text-2xl text-b'>{quantidadeAgendamentos}</span>}</span>
                                    <Button
                                      disabled={dia.dayOfWeek === "Dom" || quantidadeAgendamentos === 0}
                                      size={'icon'}
                                      onClick={() => handleVieweAgendamento(hora, quantidadeAgendamentos, chave)}
                                      className='bg-zinc-700 hover:bg-zinc-600 dark:bg-zinc-300 dark:hover:bg-zinc-200'
                                    >
                                      <Eye size={12} />
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

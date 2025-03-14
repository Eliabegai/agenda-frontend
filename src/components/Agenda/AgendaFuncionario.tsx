"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye, Pencil } from "lucide-react";
import { format, addDays, startOfWeek, addHours } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { useCurrentDate, useFuncionarioContext } from '../hooks/PageContext';
import VisualizarAgenda from './VisualizaraAgenda';
import { Modal } from '../Dialog/Modal';
import { toast } from 'sonner';
import { gerarHorarios, returnNextSevenDays } from '@/utils/gerarHorarios';
import ModalAgenda from './ModalAgenda';

const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

interface DateInfo {
  dayOfWeek: string;
  dayOfMonth: string;
  dayOfMonthNumber: number;
  month: string;
  fullDate: string
}

export default function AgendaFuncionario() {

  const { currentDate, changeWeek} = useCurrentDate()
  const {getAgendamentosByFuncionario, getUserData, agendamentos, getToken} = useFuncionarioContext()
  const token = getToken()
  const idFuncionario = getUserData()?.id
  const email = getUserData()?.email
  const [dates, setDates] = useState<DateInfo[]>([])
  const [mesAtual, setMesAtual] = useState('')
  const [horarios, setHorarios] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [horaAgendamento, setHoraAgendamento] = useState<string[]>([])
  const [agendamentosPorHorario, setAgendamentosPorHorario] = useState<{ [key: string]: IAgendamento[] }>({});
  const [agendamentosFiltrados, setAgendamentosFiltrados] = useState<IAgendamento | null>(null);

  const url = process.env.NEXT_PUBLIC_API_URL


  const getAgendamentos = async () => {
    if(!idFuncionario) return
    try{
      getAgendamentosByFuncionario(idFuncionario)
      toast.success('Agenda atualizada')
    } catch (error) {
      console.error('Erro ao buscar os dados', error)
      toast.error('Erro ao buscar os dados')
    }
  }

  const agruparAgendamentosPorHorario = (agendamentos: IAgendamento[]) => {
    const agendamentosAgrupados: { [key: string]: IAgendamento[] } = {};
    console.log(agendamentosAgrupados)

    agendamentos?.forEach(agendamento => {
      console.log('teste', agendamento)
      const dataHora = new Date(agendamento.dataHora);
      const dia = format(dataHora, 'yyyy-MM-dd');
      const hora = format(dataHora, 'HH:mm');
      const chave = `${dia} ${hora}`;

      if (!agendamentosAgrupados[chave]) {
          agendamentosAgrupados[chave] = [];
      }
      agendamentosAgrupados[chave].push(agendamento);
    });

    setAgendamentosPorHorario(agendamentosAgrupados);
  };

  const getAgendamentosPorDataHora = async (id: string) => {

    if (!token) {
      toast.error('Token não encontrado');
      return;
    }
    if(!email) return

    try{
      const response = await fetch(`${url}/agendamento/${id}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          'token': token,
          'admin': email
        },
      })
      const data = await response.json()
      console.log(data)
      setAgendamentosFiltrados(data.data)
    } catch (error) {
      console.error('Erro ao buscar os dados', error)
      toast.error('Erro ao buscar os dados')
    }

  };


  useEffect(()=>{
    const startDate = startOfWeek(currentDate, { weekStartsOn: 0 })
    
    const nextSevenDays = returnNextSevenDays(startDate)
    setDates(nextSevenDays) 
    
    setMesAtual(format(currentDate, "MMMM", { locale: ptBR }))

    const horarios = gerarHorarios("07:00", "20:00", 30)
    setHorarios(horarios)

    getAgendamentos()
  },[currentDate])

  useEffect(() => {
    agruparAgendamentosPorHorario(agendamentos);
  }, [agendamentos]);

  const handleVieweAgendamento = (id: string) => {
    getAgendamentosPorDataHora(id)
    setOpen(!open)
  }

  // console.log('agendamentos', agendamentos)
  // console.log('dates', dates)
  // console.log('horarios', horarios)
  // console.log('horaAgendamento', horaAgendamento)
  // console.log('agendamentosPorHorario', agendamentosPorHorario)
  // console.log('agendamentosFiltrados', agendamentosFiltrados)
  
  return (
    <div className="flex flex-col w-full p-4 rounded-xl shadow-md left-0 top-0 absolute">
      <div className="flex justify-end items-center space-x-2 px-2 sticky top-0 z-10 bg-primary-foreground">
        <Button variant="ghost" onClick={() => changeWeek(-1)}><ChevronLeft /></Button>
        <h2 className="text-lg font-bold capitalize">{mesAtual}</h2>
        <Button variant="ghost" onClick={() => changeWeek(1)}><ChevronRight /></Button>
      </div>

      <ModalAgenda open={open} setOpen={() => setOpen(!open)} agendamento={agendamentosFiltrados} />

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
                      // const chave = `${format(currentDate, 'yyyy-MM-dd')} ${hora}`
                      const chave = `${dia.fullDate} ${hora}`
                      const quantidadeAgendamentos = agendamentosPorHorario[chave] || 0

                      return (
                        <td
                          key={j}
                          className={`
                            text-center border p-2 rounded-lg font-normal hover:bg-primary-foreground
                            ${dia.dayOfWeek === "Dom" ? "opacity-30" : "opacity-100"}
                            ${quantidadeAgendamentos.length === 1 ? "bg-blue-300 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600" : ""}
                            ${quantidadeAgendamentos.length > 4 ? "bg-red-300 hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600" : ""}
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
                                    <span className='font-normal'>{dia.dayOfWeek === "Dom" ? "---" : <span className='text-2xl text-b'>{quantidadeAgendamentos.length ?? 0}</span>}</span>
                                    <Button
                                      disabled={dia.dayOfWeek === "Dom" || quantidadeAgendamentos.length === 0}
                                      size={'icon'}
                                      onClick={() => handleVieweAgendamento(quantidadeAgendamentos?.[0].id)}
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

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye, Pencil } from "lucide-react";
import { format, addDays, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { useCurrentDate } from '../hooks/PageContext';
import VisualizarAgenda from './VisualizaraAgenda';
import { Modal } from '../Dialog/Modal';
import { api } from '../../../api.js'
import { toast } from 'sonner';
import { agendamentosMockFuncionario } from './agendamentosMock';

const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];


interface DateInfo {
  dayOfWeek: string;
  dayOfMonth: string;
  dayOfMonthNumber: number;
  month: string;
}

interface Agendamento {
  id: string;
  protocoloId: string;
  dataHora: string;
  criadoEm: string;
  atualizadoEm: string;
  status: string;
  userId: string;
}

export default function AgendaFuncionario() {
  const { currentDate, changeWeek} = useCurrentDate()
  const [dates, setDates] = useState<DateInfo[]>([])
  const [mesAtual, setMesAtual] = useState('')
  const [horarios, setHorarios] = useState<string[]>([])
  const [openForm, setOpenForm] = useState(false)
  const [horaAgendamento, setHoraAgendamento] = useState<string[]>([])
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [agendamentosPorHorario, setAgendamentosPorHorario] = useState<{ [key: string]: number }>({});

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

  const getAgendamentos = async () => {
    try{
      const response = await api.get('/agendamentos')
      setAgendamentos(response.data)
      toast.success('Agenda atualizada')
    } catch (error) {
      console.error('Erro ao buscar os dados', error)
      toast.error('Erro ao buscar os dados')
    }
  }

  const agruparAgendamentosPorHorario = (agendamentos: Agendamento[]) => {
    const agendamentosAgrupados: { [key: string]: number } = {};

    agendamentos.forEach(agendamento => {
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
    getAgendamentos()
  },[currentDate])

  useEffect(() => {
    agruparAgendamentosPorHorario(agendamentos);
  }, [agendamentos]);

  const handleClickForm = (hora: string, day: string, month: number) => {
    const year = new Date().getFullYear()
    const agendamento = [hora, `${year}-${month+1}-${day}`]
    setHoraAgendamento(agendamento)
    setOpenForm(!openForm)
  }
  
  return (
    <div className="flex flex-col w-full p-4 rounded-xl shadow-md left-0 top-0 absolute">
      <div className="flex justify-end items-center space-x-2 px-2 sticky top-0 z-10 bg-primary-foreground">
        <Button variant="ghost" onClick={() => changeWeek(-1)}><ChevronLeft /></Button>
        <h2 className="text-lg font-bold capitalize">{mesAtual}</h2>
        <Button variant="ghost" onClick={() => changeWeek(1)}><ChevronRight /></Button>
      </div>

      <Modal open={openForm} openChange={() => setOpenForm(!openForm)} title='Agendar Horário'>
        {/* <VisualizarAgenda /> */}
      </Modal>

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
            {/* <tbody>
              { horarios.map((hora, i) => (
                <tr key={i}>
                  {dates.map((dia, j) => (
                    <td 
                      key={j} 
                      data-inative={dia.dayOfWeek === "Dom"}
                      data-inativeDay={(agendamentosMockFuncionario?.[i]?.[j] === 1)}
                      className={`
                        text-center border p-2 rounded-lg font-normal hover:bg-primary-foreground
                        data-[inative=true]:opacity-30
                        data-[inativeDay=true]:bg-green-400 data-[inativeDay=true]:hover:bg-green-500
                        data-[inativeDay=true]:dark:bg-green-700 data-[inativeDay=true]:dark:hover:bg-green-600
                        data-[inativeDay=false]:opacity-30 data-[inativeDay=false]:bg-zinc-100 data-[inativeDay=false]:dark:bg-zinc-800
                    `}>
                      <div className='flex flex-row w-full justify-center items-center space-x-2'>
                        <div className='flex flex-row space-x-1 text-sm justify-center items-center'>
                          <span>{hora}</span>
                          {(dia.dayOfWeek !== "Dom") &&
                            <span className='text-xs'>Agendado</span>
                          }
                        </div>
                        {
                          (dia.dayOfWeek !== "Dom") &&
                              <Button 
                                disabled={dia.dayOfWeek === "Dom" ||  (agendamentosMockFuncionario?.[i]?.[j] === 0)} 
                                size={'icon'} 
                                onClick={() => handleClickForm(hora, dia.dayOfMonth, dia.dayOfMonthNumber)}
                                className='bg-zinc-700 dark:bg-zinc-300 dark:hover:bg-zinc-200'
                              >
                                <Eye size={12} />
                              </Button>
                          }
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody> */}

            <tbody>
              { horarios.map((hora, i) => (
                <tr key={i}>
                  {
                    dates.map((dia, j) => {
                      const chave = `${format(currentDate, 'yyyy-MM-dd')} ${hora}`
                      const quantidadeAgendamentos = agendamentosPorHorario[chave] || 0

                      return (
                        <td
                          key={j}
                          className={`
                            text-center border p-2 rounded-lg font-normal hover:bg-primary-foreground
                            ${dia.dayOfWeek === "Dom" ? "opacity-30" : "opacity-100"}
                            ${quantidadeAgendamentos > 4 ? "bg-red-300 hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600" : ""}
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
                                      disabled={dia.dayOfWeek === "Dom" || quantidadeAgendamentos > 4}
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

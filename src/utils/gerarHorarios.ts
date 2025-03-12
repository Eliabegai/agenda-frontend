import { addDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

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

  return horarios
};

const returnNextSevenDays = (startDate: Date) => {
  
  const nextSevenDays = Array.from({length: 7}, (_, i) => {
    const newDate = addDays(startDate, i)
    return{
      dayOfWeek: daysOfWeek[newDate.getDay()],
      dayOfMonth: format(newDate, "d"),
      month: format(newDate, "MMMM", { locale: ptBR }),
      dayOfMonthNumber: newDate.getDay(),
      fullDate: format(newDate, 'yyyy-MM-dd')
    }
  })

  return nextSevenDays

}

export { gerarHorarios, returnNextSevenDays }
"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale/pt-BR"
import { Calendar, Clock, Copy, FileText, Mail, Phone, RefreshCw, User, Check } from "lucide-react"
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { useCurrentAdminOrUser } from '../hooks/PageContext'


interface CardAgendaProps {
  agenda: IAgendamento
  updateAgendamento: (dataHora:string) => void
}

export default function CardAgenda({ agenda, updateAgendamento }: CardAgendaProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [copied, setCopied] = useState(false)
  const {getToken, email} = useCurrentAdminOrUser()
  const url = process.env.NEXT_PUBLIC_API_URL
  const token = getToken()

  const dataFormatada = format(new Date(agenda.dataHora), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  const horaFormatada = format(new Date(agenda.dataHora), "HH:mm'h'", { locale: ptBR })
  const dataFormatada2 = format(new Date(agenda.dataHora), "yyyy-MM-dd", { locale: ptBR })
  const horaFormatada2 = format(new Date(agenda.dataHora), "HH:mm", { locale: ptBR })

  const diaSemana = format(new Date(agenda.dataHora), "EEEE", { locale: ptBR })
  const dataAbreviada = format(new Date(agenda.dataHora), "dd/MM", { locale: ptBR })

  const updateDate = `${dataFormatada2} ${horaFormatada2}`

  const handleChangeFuncionario = async (id: string) => {
    setIsLoading(true)

    if (!token) {
      toast.error('Token não encontrado');
      return;
    }

    try {
      const response = await fetch(`${url}/agendamento/${id}/func`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          'token': token,
          'admin': email
        },
        body: ""
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

      toast.success("Agendamento Atualizado",{
        description: "Funcionário trocado com sucesso.",
      })
      updateAgendamento(updateDate)
    } catch (error) {
      console.error('Erro ao buscar os dados', error)
    } finally{
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)

    toast("Email copiado", {
      description: "O email foi copiado para a área de transferência.",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="overflow-auto min-w-lg max-w-xl transition-all duration-300 hover:shadow-md">
      <CardHeader className="bg-primary/5 pb-3 pt-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center justify-center bg-background rounded-md p-2 w-14 h-14 shadow-sm">
              <span className="text-sm font-medium">{dataAbreviada}</span>
              <span className="text-xs text-muted-foreground capitalize">{diaSemana.substring(0, 3)}</span>
            </div>
            <div>
              <h3 className="font-medium text-lg">{agenda.protocolo.cliente.nome}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{horaFormatada}</span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="font-medium">
            #{agenda.protocolo.codigo}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details" className="border-0">
            <div className="px-6 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{agenda.User.nome}</span>
              </div>

              <AccordionTrigger className="py-0">
                <span className="text-xs font-medium text-muted-foreground mr-2">Detalhes</span>
              </AccordionTrigger>
            </div>

            <AccordionContent className="px-6 pb-4 pt-0">
              <Separator className="mb-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{dataFormatada}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{agenda.protocolo.cliente.telefone}</span>
                  </div>

                  <div className="flex items-center gap-2 group">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm truncate">{agenda.protocolo.cliente.email}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => copyToClipboard(agenda.protocolo.cliente.email)}
                          >
                            {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copiar email</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Protocolo: {agenda.protocolo.codigo}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Horário: {horaFormatada}</span>
                  </div>

                  <div className="flex justify-end">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => handleChangeFuncionario(agenda.id)}
                            disabled={isLoading}
                          >
                            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
                            Trocar
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Trocar Funcionário</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
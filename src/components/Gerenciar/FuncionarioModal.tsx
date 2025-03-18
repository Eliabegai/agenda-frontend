"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Clock, User } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

const getDiaSemana = (dia: number): string => {
  const diasSemana = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ]
  return diasSemana[dia] || ""
}

interface FuncionarioModalProps {
  funcionario: IFuncionario | null
  open: boolean
  setOpen: () => void
}

export default function FuncionarioModal({funcionario, open, setOpen}: FuncionarioModalProps) {

  if(funcionario === null) return

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[800px] flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalhes do Funcionário
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4 sticky top-20 z-10">
          <div className="flex flex-col space-y-1">
            <div className='flex w-full justify-between'>
              <h3 className="text-xl font-bold">{funcionario.nome}</h3>
              <Badge className="w-fit mt-1 mr-2" variant={funcionario.role === "ADMIN" ? "destructive" : "default"}>
                {funcionario.role}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{funcionario.email}</p>
          </div>
        </div>

        <Tabs defaultValue="horarios">
          <TabsList className="grid w-full grid-cols-3 sticky top-20 z-10">
            <TabsTrigger value="horarios">Horários de Trabalho</TabsTrigger>
            <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
            <TabsTrigger value="indisponibilidade">Indisponibilidade</TabsTrigger>
          </TabsList>

          <TabsContent value="horarios" className='h-96 overflow-auto'>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Horários de Trabalho
                </CardTitle>
                <CardDescription>Horários semanais do funcionário incluindo intervalos</CardDescription>
              </CardHeader>
              <CardContent>
                <Table className='table-fixed'>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-1/4 text-left'>Dia</TableHead>
                      <TableHead className='w-1/4 text-center'>Início</TableHead>
                      <TableHead className='w-1/4 text-center'>Intervalo</TableHead>
                      <TableHead className='w-1/4 text-center'>Fim</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {funcionario.horarios
                      .sort((a, b) => a.diaSemana - b.diaSemana)
                      .map((horario) => (
                        <TableRow key={horario.id}>
                          <TableCell className="font-medium">{getDiaSemana(horario.diaSemana)}</TableCell>
                          <TableCell className='text-center'>{horario.startTime.substring(0, 5)}</TableCell>
                          <TableCell className='text-center'>
                            {horario.breakStart.substring(0, 5)} - {horario.breakEnd.substring(0, 5)}
                          </TableCell>
                          <TableCell className='text-center'>{horario.endTime.substring(0, 5)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agendamentos" className='max-h-96 overflow-auto'>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Agendamentos
                </CardTitle>
                <CardDescription>Lista de agendamentos do funcionário</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data e Hora</TableHead>
                      <TableHead>Protocolo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criado em</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {funcionario.agendamentos
                      .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime())
                      .map((agendamento) => (
                        <TableRow key={agendamento.id}>
                          <TableCell className="font-medium">
                            {format(new Date(agendamento.dataHora), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {agendamento.protocoloId.substring(0, 8)}...
                          </TableCell>
                          <TableCell>
                            <Badge variant={agendamento.status === "AGENDADO" ? "outline" : "secondary"}>
                              {agendamento.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {format(new Date(agendamento.criadoEm), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="indisponibilidade" className='h-96 overflow-auto'>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Indisponibilidade
                </CardTitle>
                <CardDescription>Lista de Indisponibilidade</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data Início</TableHead>
                      <TableHead>Data Fim</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {funcionario?.indisponibilidades &&
                      funcionario?.indisponibilidades.map((indisponivel) => (
                        <TableRow key={indisponivel.id}>
                          <TableCell className="font-medium">
                            {format(new Date(indisponivel.dataInicio), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                          </TableCell>
                          <TableCell className="font-medium">
                            {format(new Date(indisponivel.dataFim), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                          </TableCell>
                          <TableCell>
                            <Badge variant={"destructive"}>
                              Bloqueado
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}


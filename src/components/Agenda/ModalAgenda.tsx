import { Calendar, ClipboardList, Clock, FileText, Mail, Phone, User, UserRound } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

interface ModalAgendaProps {
  open: boolean
  setOpen: () => void
  agendamento: IAgendamento | null
}

export default function ModalAgenda({open, setOpen, agendamento}:ModalAgendaProps) {
  if(agendamento === null) return
  return(
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[800px] flex flex-col max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Detalhes do Agendamento
          </DialogTitle>
        </DialogHeader>

        <div className='flex flex-row gap-2 w-full'>
          {/* Informações do Agendamento */}
          <Card className='w-1/2'>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Informações do Agendamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Data e Hora:</span>
                </div>
                <span className="text-sm">
                  {format(new Date(agendamento?.dataHora), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Status:</span>
                </div>
                <Badge variant={agendamento.status === "AGENDADO" ? "outline" : "secondary"}>{agendamento.status}</Badge>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Criado em:</span>
                </div>
                <span className="text-sm">
                  {format(new Date(agendamento.criadoEm), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Atualizado em:</span>
                </div>
                <span className="text-sm">
                  {format(new Date(agendamento.atualizadoEm), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Funcionário */}
          <Card className='w-1/2'>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4" />
                Funcionário Responsável
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Nome:</span>
                </div>
                <span className="text-sm">{agendamento.User.nome}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Email:</span>
                </div>
                <span className="text-sm">{agendamento.User.email}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Função:</span>
                </div>
                <Badge variant={agendamento.User.role === "ADMIN" ? "destructive" : "default"}>
                  {agendamento.User.role}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* <Separator className="my-2" /> */}

        {/* Informações do Protocolo e Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Protocolo e Cliente
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Protocolo</h4>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Código:</span>
                </div>
                <span className="text-sm font-mono">{agendamento.protocolo.codigo}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">ID:</span>
                </div>
                <span className="font-mono text-xs">{agendamento.protocolo.id}</span>
              </div>
            </div>

            <Separator className="my-2" />

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Cliente</h4>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Nome:</span>
                </div>
                <span className="text-sm">{agendamento.protocolo.cliente.nome}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Telefone:</span>
                </div>
                <span className="text-sm">{agendamento.protocolo.cliente.telefone}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Email:</span>
                </div>
                <span className="text-sm">{agendamento.protocolo.cliente.email}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Cliente desde:</span>
                </div>
                <span className="text-sm">
                  {format(new Date(agendamento?.protocolo.cliente.criadoEm), "dd/MM/yyyy", { locale: ptBR })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

      </DialogContent>
    </Dialog>
  )
}
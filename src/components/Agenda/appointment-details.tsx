"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale/pt-BR"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from '../ui/dialog'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'

interface AppointmentDetailsProps {
  appointment: IAgendamento
  open: boolean
  onClose: () => void
}

export default function AppointmentDetails({ appointment, onClose, open }: AppointmentDetailsProps) {
  if (!appointment) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <Card>
          <CardContent>
              <h2 className="text-xl font-bold mb-4">Detalhes do Agendamento</h2>
              <div className='space-y-2'>
                <Card className='p-6 flex flex-row justify-between items-center shadow-lg hover:transform-3d'>
                  <h3 className="font-medium text-sm text-muted-foreground">Protocolo</h3>
                  <Badge variant={'outline'}>
                    <span className="text-sm">{appointment.protocolo?.codigo}</span>
                  </Badge>
                </Card>

                <Card className='p-6 flex flex-row justify-between items-center shadow-lg hover:transform-3d'>
                  <h3 className="font-medium text-sm text-muted-foreground">Data e Hora</h3>
                  <p className="text-sm">{formatDate(appointment.dataHora)}</p>
                </Card>

                <Card className='p-6 flex flex-row justify-between items-center shadow-lg hover:transform-3d'>
                  <h3 className="font-medium text-sm text-muted-foreground">Status</h3>
                  <p className="text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {appointment.status}
                    </span>
                  </p>
                </Card>

                <Card className='p-6 flex flex-row justify-between items-center shadow-lg hover:transform-3d'>
                  <h3 className="font-medium text-sm text-muted-foreground">Criado em</h3>
                  <p className="text-sm">{formatDate(appointment.criadoEm)}</p>
                </Card>
              </div>

              <div className="mt-6">
                <Button onClick={onClose} className="w-full">
                  Fechar
                </Button>
              </div>
          </CardContent>
        </Card>
      </DialogContent>

    </Dialog>
  )
}


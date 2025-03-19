"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Ban, Calendar, Clock, Copy, Mail, MoreHorizontal, Pencil, Trash } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent } from '../ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { toast } from 'sonner'


interface CardUserProps {
  funcionario: IFuncionario
  handleEditUser: (id: string) => void
  handleRemoveUser: (id: string) => void
  handleIndisponivelUser: (id: string) => void
}

export default function CardUser({
  funcionario,
  handleEditUser,
  handleRemoveUser,
  handleIndisponivelUser,
}: CardUserProps) {

  const [indisponibilidade, setIndisponibilidade] = useState<string>("")
  const [indisponivel, setIndisponivel] = useState(false)
  const [copied, setCopied] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }

  const isIndisponivel = () => {
    if (funcionario?.indisponibilidades[0]) {
      const indisp = funcionario.indisponibilidades[0]
      const now = new Date()
      const dataInicio = new Date(indisp.dataInicio)
      const dataFim = new Date(indisp.dataFim)

      const dia = format(dataFim, "dd/MM")
      const hora = format(dataFim, "HH:mm")

      setIndisponibilidade(`Até ${dia} às ${hora}h`)
      return now >= dataInicio && now <= dataFim
    } else {
      return false
    }
  }

  const handleCopy = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      toast.success('Copiado email!')
      setTimeout(() => setCopied(false), 2000); // Reseta o estado após 2 segundos
    } catch (error) {
      console.error("Erro ao copiar o e-mail:", error);
    }
  };

  useEffect(() => {
    const indisponivel = isIndisponivel()
    setIndisponivel(indisponivel)
  }, [funcionario])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: 5 }}
      className="w-full max-w-xl"
    >
      <Card className={`overflow-hidden ${indisponivel ? "border-destructive/50" : "border-border"}`}>
          {indisponivel && (
            <div className="bg-destructive/10 px-4 py-1 text-center">
              <p className="text-xs font-medium text-destructive flex items-center justify-center gap-1">
                <Clock className="h-3 w-3" />
                {indisponibilidade}
              </p>
            </div>
          )}

        <CardContent className="px-4 py-1">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/10">
              <AvatarFallback className="bg-primary/5 text-primary">{getInitials(funcionario.nome)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg line-clamp-1">{funcionario.nome}</h3>

                <TooltipProvider>
                  <DropdownMenu>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Opções</p>
                      </TooltipContent>
                    </Tooltip>

                    <DropdownMenuContent align="end" className="w-[180px]">
                      <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditUser(funcionario.id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => handleIndisponivelUser(funcionario.id)}
                        disabled={indisponivel}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Bloquear agenda</span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="cursor-pointer text-destructive focus:text-destructive"
                        onClick={() => handleRemoveUser(funcionario.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Excluir</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipProvider>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" className="flex items-center text-sm text-muted-foreground" onClick={() => handleCopy(funcionario.email)}>
                      <Mail className="h-3.5 w-3.5" />
                      <span className="w-20 lg:w-36 line-clamp-1 truncate">{funcionario.email}</span>
                      <Copy className="ml-1 h-3.5 w-3.5 opacity-50" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copied ? "Copiado!" : "Copiar e-mail"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="flex items-center justify-between pt-2">
                <Badge variant={funcionario.role === "ADMIN" ? "default" : "outline"}>{funcionario.role}</Badge>

                <div className="hidden lg:flex gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={indisponivel ? "destructive" : "outline"}
                          size="icon"
                          className="h-8 w-8"
                          disabled={indisponivel}
                          onClick={() => handleIndisponivelUser(funcionario.id)}
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Bloquear agenda</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditUser(funcionario.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Editar</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleRemoveUser(funcionario.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Excluir</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
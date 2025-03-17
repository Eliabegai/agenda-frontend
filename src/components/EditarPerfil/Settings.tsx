"use client"

import { AlertCircle, Calendar as Calendario, CalendarIcon, Clock, Plus, Save, Trash2, User, EyeOff, Eye } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { useFuncionarioContext } from '../hooks/PageContext'
import { useEffect, useState } from 'react'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Textarea } from '../ui/textarea'
import { Calendar } from '../ui/calendar'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle } from '../ui/alert-dialog'
import { SkeletonIndisponibilidadeItem } from '../Skeletons/SkeletonIndisponibilidade'


interface EmployeeEditFormProps {
  open: boolean
  setOpen: () => void
}

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

// Esquemas de validação
const profileFormSchema = z.object({
    nome: z.string().min(2, {message: "O nome deve ter pelo menos 2 caracteres.",}),
    senha: z.string().min(6, {message: "A senha deve ter pelo menos 6 caracteres.",}).optional(),
    confirmarSenha: z.string().optional(),
    senhaAtual: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.senha && !data.confirmarSenha) return false
      if (!data.senha && data.confirmarSenha) return false
      if (data.senha && data.confirmarSenha && data.senha !== data.confirmarSenha) return false
      return true
    },
    {
      message: "As senhas não coincidem",
      path: ["confirmarSenha"],
    },
  )

const horarioFormSchema = z.object({
  id: z.string(),
  diaSemana: z.number().min(0).max(6),
  startTime: z.string(),
  endTime: z.string(),
  breakStart: z.string(),
  breakEnd: z.string(),
})

const formatTime = (time: string) => {
  // Se o tempo já tiver segundos, retorna como está
  if (time.length === 8) return time;
  // Se for "HH:MM", adiciona ":00" no final
  return `${time}:00`;
};

const indisponibilidadeFormSchema = z
  .object({
    dataInicio: z.date({required_error: "A data de início é obrigatória.",}),
    horaInicio: z.string({required_error: "A hora de início é obrigatória.",}),
    dataFim: z.date({required_error: "A data de fim é obrigatória.",}),
    horaFim: z.string({required_error: "A hora de fim é obrigatória.",}),
    motivo: z.string().optional(),
  })
  .refine(
    (data) => {
      const dataInicioCompleta = new Date(data.dataInicio)
      const [horaInicio, minutoInicio] = data.horaInicio.split(":").map(Number)
      dataInicioCompleta.setHours(horaInicio, minutoInicio)

      const dataFimCompleta = new Date(data.dataFim)
      const [horaFim, minutoFim] = data.horaFim.split(":").map(Number)
      dataFimCompleta.setHours(horaFim, minutoFim)

      return dataFimCompleta > dataInicioCompleta
    },
    {
      message: "A data/hora de fim deve ser posterior à data/hora de início",
      path: ["dataFim"],
    },
  )

export default function EmployeeEditForm({ open, setOpen }: EmployeeEditFormProps) {

  const [editingHorario, setEditingHorario] = useState<IHorario | null>(null)
  const {funcionario, getFuncionarioById, getUserData, getToken, updateFuncionario} = useFuncionarioContext()
  const funcionarioId = getUserData()?.id || ''
  const [indisponibilidades, setIndisponibilidades] = useState<IIndisponibilidade[]>(funcionario?.indisponibilidades || [])
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isCreatingHorario, setIsCreatingHorario] = useState<boolean>(false);
  const url = process.env.NEXT_PUBLIC_API_URL
  const token = getToken()
  const [showMessage, setShowMessage] = useState(false)
  const [showMessageIndisponivel, setShowMessageIndisponivel] = useState(false)
  const [loading, setLoading] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Formulário de perfil
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      nome: funcionario?.nome
    },
  })

  // Formulário de horário
  const horarioForm = useForm<z.infer<typeof horarioFormSchema>>({
    resolver: zodResolver(horarioFormSchema),
    defaultValues: {
      id: editingHorario?.id || '',
      diaSemana: Number(editingHorario?.diaSemana) || 0,
      startTime: editingHorario?.startTime || '',
      endTime: editingHorario?.endTime || '',
      breakStart: editingHorario?.breakStart || '',
      breakEnd: editingHorario?.breakEnd || '',
    },
  });

  const indisponibilidadeForm = useForm<z.infer<typeof indisponibilidadeFormSchema>>({
    resolver: zodResolver(indisponibilidadeFormSchema),
    defaultValues: {
      dataInicio: new Date(),
      horaInicio: "09:00",
      dataFim: new Date(),
      horaFim: "18:00",
      motivo: "",
    },
  })

  async function onProfileSubmit(data: z.infer<typeof profileFormSchema>) {
    console.log("Dados do perfil:", data)

    if (!token) {
      toast.error('Token não encontrado');
      return;
    }

    if (!funcionario) {
      toast.error('Funcionario não encontrado');
      return;
    }

    const body = {
      "senhaAntiga": data.senhaAtual,
      "novaSenha": data.confirmarSenha,
      "nome": data.nome
    }

    try{
      await fetch(`${url}/user/${funcionario.id}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          'token': token,
        },
        body: JSON.stringify(body)
      })
      toast.success("Perfil atualizado",{
        description: "As informações do perfil foram atualizadas com sucesso.",
      })
      updateFuncionario(funcionario.id)
      setOpen()
    } catch (error) {
      console.error('Erro ao buscar os dados', error)
      toast.error('Erro ao buscar os dados')
    }
  }

  async function onHorarioSubmit(data: z.infer<typeof horarioFormSchema>) {

    if (!token) {
      toast.error('Token não encontrado');
      return;
    }

    if (!funcionario) {
      toast.error('Funcionario não encontrado');
      return;
    }
   
    const body = {
      "horarios": [{
        "id": data.id,
        "diaSemana": Number(data.diaSemana),
        "startTime": formatTime(data.startTime),
        "endTime": formatTime(data.endTime),
        "breakStart": formatTime(data.breakStart),
        "breakEnd": formatTime(data.breakEnd)
      }]
    }

    try{
      await fetch(`${url}/user/${funcionario.id}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          'token': token,
        },
        body: JSON.stringify(body)
      })
      toast.success("Horário atualizado",{
        description: "O horário foi atualizado com sucesso.",
      })
      updateFuncionario(funcionario.id)
      setEditingHorario(null)
    } catch (error) {
      console.error('Erro ao buscar os dados', error)
      toast.error('Erro ao buscar os dados')
    }
  }

  async function removeHorario(horarioId: string) {
    if (!token) {
      toast.error("Token não encontrado")
      return
    }

    if (!funcionario) {
      toast.error("Funcionario não encontrado")
      return
    }
    
    setShowMessage(false)


    try {
      await fetch(`${url}/user/horario/${horarioId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      })

      toast.success("Horário removido", {
        description: "O horário foi removido com sucesso.",
      })

      updateFuncionario(funcionario.id)
    } catch (error) {
      console.error("Erro ao remover horário", error)
      toast.error("Erro ao remover horário")
    }
  }

  async function onIndisponibilidadeSubmit(data: z.infer<typeof indisponibilidadeFormSchema>) {
    const dataInicioCompleta = new Date(data.dataInicio)
    const [horaInicio, minutoInicio] = data.horaInicio.split(":").map(Number)
    dataInicioCompleta.setHours(horaInicio, minutoInicio)

    const dataFimCompleta = new Date(data.dataFim)
    const [horaFim, minutoFim] = data.horaFim.split(":").map(Number)
    dataFimCompleta.setHours(horaFim, minutoFim)
    
    setLoading(true)

    if (!token) {
      toast.error('Token não encontrado');
      return;
    }

    if (!funcionario) {
      toast.error('Funcionario não encontrado');
      return;
    }

    const novaIndisponibilidade = {
      dataInicio: dataInicioCompleta.toString(),
      dataFim: dataFimCompleta.toString(),
      motivo: data.motivo,
    }

    try{
      await fetch(`${url}/user/${funcionario.id}/indisponibilidade`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          'token': token,
        },
        body: JSON.stringify(novaIndisponibilidade)
      })
    } catch (error) {
      console.error('Erro ao buscar os dados', error)
      toast.error('Erro ao buscar os dados')
    } finally {
      toast.success("Indisponibilidade registrada",{
        description: "O período de indisponibilidade foi registrado com sucesso.",
      })
      
      updateFuncionario(funcionario.id)
      setLoading(false)

      indisponibilidadeForm.reset({
        dataInicio: new Date(),
        horaInicio: "09:00",
        dataFim: new Date(),
        horaFim: "18:00",
        motivo: "",
      })
    }

  }

  function editHorario(horario: IHorario) {
    setEditingHorario(horario)
    horarioForm.reset({
      id: horario.id,
      startTime: horario.startTime.substring(0, 5),
      endTime: horario.endTime.substring(0, 5),
      breakStart: horario.breakStart.substring(0, 5),
      breakEnd: horario.breakEnd.substring(0, 5),
    })
  }

  async function removeIndisponibilidade(id: string) {

    if (!token) {
      toast.error('Token não encontrado');
      return;
    }

    if (!funcionario) {
      toast.error('Funcionario não encontrado');
      return;
    }

    try{
      await fetch(`${url}/user/${funcionario.id}/indisponibilidade/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          'token': token,
        },
      })
    } catch (error) {
      console.error('Erro ao buscar os dados', error)
      toast.error('Erro ao buscar os dados')
    } finally {
      toast.success("Indisponibilidade removida",{
        description: "O período de indisponibilidade foi removido com sucesso.",
      })
      
      updateFuncionario(funcionario.id)
      setShowMessageIndisponivel(false)
      setLoading(false)

      indisponibilidadeForm.reset({
        dataInicio: new Date(),
        horaInicio: "09:00",
        dataFim: new Date(),
        horaFim: "18:00",
        motivo: "",
      })
    }
    
  }

  const handleCreateHorario = () => {
    setIsCreatingHorario(true);
    setEditingHorario({
      id: '', // ID vazio para indicar que é um novo horário
      diaSemana: 0,
      startTime: '09:00',
      endTime: '18:00',
      breakStart: '12:00',
      breakEnd: '13:00',
      userId: funcionarioId
    });
  };
  
  const handleCancelCreate = () => {
    setIsCreatingHorario(false);
    setEditingHorario(null);
  };

  useEffect(() => {
    if(!funcionarioId) return
    getFuncionarioById(funcionarioId)
  },[])

  useEffect(() => {
    if (funcionario) {
      profileForm.setValue('nome', funcionario.nome)
      if(funcionario.indisponibilidades) {
        setIndisponibilidades(funcionario.indisponibilidades)
      }
    }
  }, [funcionario, profileForm])

  useEffect(() => {
    if (editingHorario) {
      horarioForm.reset({
        id: editingHorario.id,
        diaSemana: Number(editingHorario.diaSemana),
        startTime: editingHorario.startTime,
        endTime: editingHorario.endTime,
        breakStart: editingHorario.breakStart,
        breakEnd: editingHorario.breakEnd,
      });
    }
  }, [editingHorario, horarioForm]);

  console.log(indisponibilidades)
  return(
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[800px] flex flex-col max-h-[90vh] overflow-auto">
        <DialogHeader className="sticky top-0 z-10 bg-background pb-4">
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalhes do Funcionário
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4 sticky top-[60px] z-10 bg-background">
          <div className="flex flex-col space-y-1">
            <h3 className="text-xl font-bold">{funcionario?.nome}</h3>
            <p className="text-sm text-muted-foreground">{funcionario?.email}</p>
            <Badge className="w-fit mt-1" variant={funcionario?.role === "ADMIN" ? "destructive" : "default"}>
              {funcionario?.role}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="horarios">
              <Clock className="h-4 w-4 mr-2" />
              Horários
            </TabsTrigger>
            <TabsTrigger value="indisponibilidade">
              <Calendario className="h-4 w-4 mr-2" />
              Indisponibilidade
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Perfil</CardTitle>
                  <CardDescription>Atualize as informações básicas do funcionário.</CardDescription>
                </CardHeader>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={profileForm.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome do funcionário" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2">
                          {funcionario?.email}
                        </Badge>
                        <Badge>{funcionario?.role}</Badge>
                      </div>

                      <FormField
                        control={profileForm.control}
                        name="senha"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nova Senha</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input type={showPassword ? "text" : "password"} placeholder="Nova senha" {...field} />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full px-3 py-2"
                                  onClick={togglePasswordVisibility}
                                  tabIndex={-1}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  <span className="sr-only">{showPassword ? "Ocultar senha" : "Mostrar senha"}</span>
                                </Button>
                              </div>
                            </FormControl>
                            <FormDescription>Deixe em branco para manter a senha atual.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="confirmarSenha"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar Senha</FormLabel>
                            <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirme a nova senha"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 py-2"
                                onClick={togglePasswordVisibility}
                                tabIndex={-1}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className="sr-only">{showPassword ? "Ocultar senha" : "Mostrar senha"}</span>
                              </Button>
                            </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter className='mt-4'>
                      <Button type="submit" variant={'outline'}>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Alterações
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>

            <TabsContent value="horarios">
              <Card>
                <CardHeader>
                  <CardTitle>Horários de Trabalho</CardTitle>
                  <CardDescription>Visualize e edite os horários de trabalho do funcionário.</CardDescription>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={handleCreateHorario}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Horário
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table className="table-fixed">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/5">Dia</TableHead>
                        <TableHead className="w-1/5">Início</TableHead>
                        <TableHead className="w-1/5">Fim</TableHead>
                        <TableHead className="w-1/5">Intervalo</TableHead>
                        <TableHead className="w-1/5 text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {funcionario?.horarios
                        .sort((a, b) => a.diaSemana - b.diaSemana)
                        .map((horario) => (
                          <TableRow key={horario.id}>
                            <TableCell className="font-medium">{getDiaSemana(horario.diaSemana)}</TableCell>
                            <TableCell>{horario.startTime.substring(0, 5)}</TableCell>
                            <TableCell>{horario.endTime.substring(0, 5)}</TableCell>
                            <TableCell>
                              {horario.breakStart.substring(0, 5)} - {horario.breakEnd.substring(0, 5)}
                            </TableCell>
                            <TableCell>
                              <div className='flex justify-center items-center gap-2'>
                                <Button variant="outline" size="sm" onClick={() => editHorario(horario)}>
                                  Editar
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="text-destructive hover:bg-destructive hover:text-background"
                                  onClick={() => setShowMessage(!showMessage)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                <AlertDialog open={showMessage} onOpenChange={() => setShowMessage(!showMessage)}>
                                    <AlertDialogContent>
                                      <AlertDialogTitle>Você tem certeza disso?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza que deseja remover este horário?
                                      </AlertDialogDescription>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <Button variant={'destructive'} onClick={() => removeHorario(horario.id)}>Continue</Button>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>

                  {editingHorario && (
                    <div className="mt-6 border rounded-md p-4">
                      <h3 className="text-lg font-medium mb-4">
                        Editar Horário - {getDiaSemana(editingHorario.diaSemana)}
                      </h3>
                      <Form {...horarioForm}>
                        <form onSubmit={horarioForm.handleSubmit(onHorarioSubmit)} className="space-y-4">
                          <FormField
                              control={horarioForm.control}
                              name="diaSemana"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Dia da Semana</FormLabel>
                                  <FormControl>
                                    <div>
                                      <Input 
                                        type="hidden"
                                        {...field}
                                        value={field.value}
                                      />
                                      {
                                        isCreatingHorario && (
                                          <select
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                          >
                                            <option value={10}>Selecione o dia</option>
                                            {["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado",].map((dia, index) => (
                                              <option key={dia} value={index}>
                                                {dia}
                                              </option>
                                            ))}
                                          </select>
                                        )
                                      }

                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={horarioForm.control}
                              name="startTime"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Horário de Início</FormLabel>
                                  <FormControl>
                                    <Input type="time" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={horarioForm.control}
                              name="endTime"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Horário de Fim</FormLabel>
                                  <FormControl>
                                    <Input type="time" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={horarioForm.control}
                              name="breakStart"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Início do Intervalo</FormLabel>
                                  <FormControl>
                                    <Input type="time" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={horarioForm.control}
                              name="breakEnd"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Fim do Intervalo</FormLabel>
                                  <FormControl>
                                    <Input type="time" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={handleCancelCreate}>
                              Cancelar
                            </Button>
                            <Button type="submit" variant={'outline'}>Salvar Horário</Button>
                          </div>
                        </form>
                      </Form>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="indisponibilidade">
              <Card>
                <CardHeader>
                  <CardTitle>Registrar Indisponibilidade</CardTitle>
                  <CardDescription>Registre períodos em que o funcionário não estará disponível.</CardDescription>
                </CardHeader>
                <Form {...indisponibilidadeForm}>
                  <form onSubmit={indisponibilidadeForm.handleSubmit(onIndisponibilidadeSubmit)}>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <FormField
                            control={indisponibilidadeForm.control}
                            name="dataInicio"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Data de Início</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button variant={"outline"} className="w-full pl-3 text-left font-normal">
                                        {field.value ? (
                                          format(field.value, "dd/MM/yyyy", { locale: ptBR })
                                        ) : (
                                          <span>Selecione uma data</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) => date < new Date()}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={indisponibilidadeForm.control}
                            name="horaInicio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Hora de Início</FormLabel>
                                <FormControl>
                                  <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="space-y-4">
                          <FormField
                            control={indisponibilidadeForm.control}
                            name="dataFim"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Data de Fim</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button variant={"outline"} className="w-full pl-3 text-left font-normal">
                                        {field.value ? (
                                          format(field.value, "dd/MM/yyyy", { locale: ptBR })
                                        ) : (
                                          <span>Selecione uma data</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) => {
                                        const dataInicio = indisponibilidadeForm.getValues("dataInicio")
                                        return date < dataInicio
                                      }}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={indisponibilidadeForm.control}
                            name="horaFim"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Hora de Fim</FormLabel>
                                <FormControl>
                                  <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <FormField
                        control={indisponibilidadeForm.control}
                        name="motivo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Motivo (opcional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Descreva o motivo da indisponibilidade"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" variant={'outline'} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Indisponibilidade
                      </Button>
                      <AlertDialog open={showMessage} onOpenChange={() => setShowMessage(!showMessage)}>
                      </AlertDialog>
                    </CardContent>
                  </form>
                </Form>

                <CardHeader className="pt-0">
                  <CardTitle className="text-lg">Períodos de Indisponibilidade</CardTitle>
                </CardHeader>
                <CardContent>
                  {indisponibilidades.length === 0 ? (
                      loading ? (
                        <SkeletonIndisponibilidadeItem />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                        <AlertCircle className="h-10 w-10 mb-2" />
                        <p>Nenhum período de indisponibilidade registrado.</p>
                      </div>
                    )
                  ) : (
                    <div className="space-y-4">
                      {indisponibilidades && indisponibilidades.map((indisponibilidade) => (
                        <div key={indisponibilidade.id} className="flex justify-between items-center p-4 border rounded-md">
                          <div>
                            <div className="font-medium">
                              {format(new Date(indisponibilidade.dataInicio), "dd/MM/yyyy HH:mm", { locale: ptBR })} até{" "}
                              {format(new Date(indisponibilidade.dataFim), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                            </div>
                            {indisponibilidade.motivo && (
                              <div className="text-sm text-muted-foreground mt-1">{indisponibilidade.motivo}</div>
                            )}
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => setShowMessageIndisponivel(!showMessageIndisponivel)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                          
                          <AlertDialog open={showMessageIndisponivel} onOpenChange={() => setShowMessageIndisponivel(!showMessageIndisponivel)}>
                            <AlertDialogContent>
                              <AlertDialogTitle>Você tem certeza disso?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover esta indisponibilidade?
                              </AlertDialogDescription>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <Button variant={'destructive'} onClick={() => removeIndisponibilidade(indisponibilidade.id)}>Continue</Button>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
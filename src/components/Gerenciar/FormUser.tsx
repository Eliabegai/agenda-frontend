"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { IMaskInput } from "react-imask"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  nome: z.string().nonempty("Nome é obrigatório"),
  email: z.string().email("Email inválido").nonempty("Email é obrigatório"),
  senha: z.string().min(5, { message: "Mínimo 5 caracteres" }),
  horarios: z.array(
    z.object({
      diaSemana: z.number(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      breakStart: z.string().optional(),
      breakEnd: z.string().optional(),
      active: z.boolean().default(false).optional(),
    }),
  ),
})

type FormValues = z.infer<typeof formSchema>

interface FormUserProps {
  onSubmit: (data: any) => void
  cancel: () => void
  loading: boolean
}

export default function FormUser({ onSubmit, cancel, loading }: FormUserProps) {
  const [repeatHorarios, setRepeatHorarios] = useState<boolean>(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      horarios: [
        { diaSemana: 1, startTime: "", breakStart: "", breakEnd: "", endTime: "", active: false },
        { diaSemana: 2, startTime: "", breakStart: "", breakEnd: "", endTime: "", active: false },
        { diaSemana: 3, startTime: "", breakStart: "", breakEnd: "", endTime: "", active: false },
        { diaSemana: 4, startTime: "", breakStart: "", breakEnd: "", endTime: "", active: false },
        { diaSemana: 5, startTime: "", breakStart: "", breakEnd: "", endTime: "", active: false },
        { diaSemana: 6, startTime: "", breakStart: "", breakEnd: "", endTime: "", active: false },
      ],
    },
  })

  const handleRepeatHorarios = () => {
    setRepeatHorarios(!repeatHorarios)
    if (!repeatHorarios) {
      const firstHorario = form.watch("horarios")[0]
      if (!firstHorario.active) return
      for (let i = 1; i < 6; i++) {
        form.setValue(`horarios.${i}.active`, true)
        form.setValue(`horarios.${i}.startTime`, firstHorario.startTime)
        form.setValue(`horarios.${i}.breakStart`, firstHorario.breakStart)
        form.setValue(`horarios.${i}.breakEnd`, firstHorario.breakEnd)
        form.setValue(`horarios.${i}.endTime`, firstHorario.endTime)
      }
    } else {
      for (let i = 1; i < 6; i++) {
        form.setValue(`horarios.${i}.active`, false)
        form.setValue(`horarios.${i}.startTime`, "")
        form.setValue(`horarios.${i}.breakStart`, "")
        form.setValue(`horarios.${i}.breakEnd`, "")
        form.setValue(`horarios.${i}.endTime`, "")
      }
    }
  }

  const handleSubmit = (data: FormValues) => {
    const body = {
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      role: "USER",
      horarios: data.horarios,
    }
    onSubmit(body)
  }

  const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Novo Funcionário</CardTitle>
        <Separator className="h-1 bg-primary rounded-lg" />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                name="nome"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="nome">Nome</Label>
                    <FormControl>
                      <Input {...field} id="nome" placeholder="Nome" autoFocus />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email">Email</Label>
                    <FormControl>
                      <Input {...field} id="email" type="email" placeholder="Email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="senha"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="senha">Senha</Label>
                    <FormControl>
                      <Input {...field} id="senha" type="password" placeholder="Senha" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Selecione os dias da semana que irá trabalhar</h3>
                <div className="flex items-center gap-2">
                  <Label htmlFor="repeat-horarios" className="text-sm">
                    Repetir horários
                  </Label>
                  <Checkbox id="repeat-horarios" checked={repeatHorarios} onCheckedChange={handleRepeatHorarios} />
                </div>
              </div>

              <div className="border rounded-md p-4 max-h-64 overflow-auto">
                <div className="grid grid-cols-[auto_1fr] gap-4">
                  {form.watch("horarios")?.map((_, index) => (
                    <div key={index} className="contents">
                      <div className="flex items-center gap-2">
                        <FormField
                          name={`horarios.${index}.active`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked)
                                    if (!checked) {
                                      form.setValue(`horarios.${index}.startTime`, "")
                                      form.setValue(`horarios.${index}.breakStart`, "")
                                      form.setValue(`horarios.${index}.breakEnd`, "")
                                      form.setValue(`horarios.${index}.endTime`, "")
                                    }
                                  }}
                                />
                              </FormControl>
                              <Label className="font-medium">{diasSemana[index]}</Label>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <FormField
                          name={`horarios.${index}.startTime`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <IMaskInput
                                  mask="00:00"
                                  placeholder="Início"
                                  value={field.value}
                                  onAccept={(value) => field.onChange(value)}
                                  disabled={!form.watch(`horarios.${index}.active`)}
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-center"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          name={`horarios.${index}.breakStart`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <IMaskInput
                                  mask="00:00"
                                  placeholder="Pausa"
                                  value={field.value}
                                  onAccept={(value) => field.onChange(value)}
                                  disabled={!form.watch(`horarios.${index}.active`)}
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-center"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          name={`horarios.${index}.breakEnd`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <IMaskInput
                                  mask="00:00"
                                  placeholder="Retorno"
                                  value={field.value}
                                  onAccept={(value) => field.onChange(value)}
                                  disabled={!form.watch(`horarios.${index}.active`)}
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-center"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          name={`horarios.${index}.endTime`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <IMaskInput
                                  mask="00:00"
                                  placeholder="Fim"
                                  value={field.value}
                                  onAccept={(value) => field.onChange(value)}
                                  disabled={!form.watch(`horarios.${index}.active`)}
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-center"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <CardFooter className="flex flex-row w-full justify-center gap-4 pt-4 px-0">
              <Button type="submit" className='' disabled={loading}>
                {loading && <Loader2 className='animate-spin' />}
                Cadastrar
                </Button>
              <Button variant="outline" type="button" className='' onClick={cancel}>
                Cancelar
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}


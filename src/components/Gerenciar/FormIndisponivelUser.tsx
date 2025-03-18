"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const formSchema = z
  .object({
    startTime: z.date({ required_error: "A data de início é obrigatória." }),
    endTime: z.date({ required_error: "A data de fim é obrigatória." }),
    motivo: z.string().optional(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "A data de fim deve ser posterior à data de início",
    path: ["endTime"],
  })

type FormValues = z.infer<typeof formSchema>

interface FormIndisponivelUserProps {
  onSubmit: (id: string, data: any) => void
  cancel: () => void
  id: string
}

export default function FormIndisponivelUser({ onSubmit, cancel, id }: FormIndisponivelUserProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      motivo: "",
    },
  })

  const handleSubmit = (data: FormValues) => {
    const body = {
      dataInicio: data.startTime,
      dataFim: data.endTime,
      motivo: data.motivo,
    }
    onSubmit(id, body)
  }

  useEffect(() => {
    const startTime = form.watch("startTime")
    if (startTime) {
      form.setValue("endTime", startTime)
    }
  }, [form.watch("startTime")])

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Bloqueio de Agenda</CardTitle>
        <Separator className="h-1 bg-primary rounded-lg" />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              name="startTime"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-base">Data e Hora de Início</FormLabel>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full sm:w-[240px] justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Selecione a data</span>}
                            <CalendarIcon className="ml-auto h-4 w-4" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="time"
                        value={field.value ? format(field.value, "HH:mm") : ""}
                        className="pl-10"
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(":").map(Number)
                          const newDate = new Date(field.value || new Date())
                          newDate.setHours(hours, minutes)
                          field.onChange(newDate)
                        }}
                      />
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="endTime"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-base">Data e Hora de Fim</FormLabel>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full sm:w-[240px] justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Selecione a data</span>}
                            <CalendarIcon className="ml-auto h-4 w-4" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const startDate = form.getValues("startTime")
                            return date < new Date(new Date().setHours(0, 0, 0, 0)) || (startDate && date < startDate)
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="time"
                        value={field.value ? format(field.value, "HH:mm") : ""}
                        className="pl-10"
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(":").map(Number)
                          const newDate = new Date(field.value || new Date())
                          newDate.setHours(hours, minutes)
                          field.onChange(newDate)
                        }}
                      />
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="motivo"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-base">Motivo</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o motivo do bloqueio (opcional)"
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={cancel} className="w-[120px]">
          Cancelar
        </Button>
        <Button onClick={form.handleSubmit(handleSubmit)} className="w-[120px]">
          Confirmar
        </Button>
      </CardFooter>
    </Card>
  )
}


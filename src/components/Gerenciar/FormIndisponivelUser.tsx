'use client'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { z } from 'zod'
import { format } from "date-fns"
import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { cn } from '@/lib/utils'
import { Textarea } from '../ui/textarea'


const schema = z.object({
  startTime: z.date({required_error: "A date of birth is required."}),
  endTime: z.date({required_error: "A date of birth is required."}),
  motivo: z.string().optional()
})

interface FormIndisponivelUserProps {
  onSubmit: (id:string, data:any) => void
  cancel: () => void
  id: string
}

const FormIndisponivelUser = ({ onSubmit, cancel, id }:FormIndisponivelUserProps) => {

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      motivo: ''
    }
  })

  const handleSubmit = (data:z.infer<typeof schema>) => {
    const body = {
      "dataInicio": data.startTime,
      "dataFim": data.endTime,
      "motivo": data.motivo
    }
    onSubmit( id , body)
  }

  useEffect(() => {
    const startTime = form.watch('startTime');
    if (startTime) {
      form.setValue('endTime', startTime);
    }
  }, [form.watch('startTime')]);

  return(
    <div className='flex flex-col w-full h-full justify-center items-center p-2'>
      <div className='flex flex-col w-full justify-center items-center'>
          <h2 className='text-3xl font-bold mb-4'>Bloqueio Agenda</h2>
          <div className='flex w-full h-2 bg-[var(--background-azul)] rounded-lg'></div>
      </div>
      <Form {...form} >
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className='flex flex-col space-y-2 mt-4'>
              <div className='flex flex-col w-full space-y-2 p-2'>
                  <FormField 
                    name='startTime'
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date e Hora de Início</FormLabel>
                        <div className='flex flex-col justify-center items-start sm:flex-row gap-2'>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPPpp")
                                  ) : (
                                    <span>Selecione a data e hora</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0' align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date(new Date().setHours(0, 0, 0, 0))
                                  }
                                  initialFocus
                                />
                            </PopoverContent>
                          </Popover>
                          <div className='flex'>
                            <Input
                              type="time"
                              value={field.value ? format(field.value, "HH:mm") : ""}
                              className='w-24'
                              onChange={(e) => {
                                const [hours, minutes] = e.target.value.split(":").map(Number);
                                const newDate = new Date(field.value || new Date());
                                newDate.setHours(hours, minutes);
                                field.onChange(newDate);
                              }}
                            />
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField 
                    name='endTime'
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date e Hora de Fim</FormLabel>
                        <div className='flex flex-col justify-center items-start sm:flex-row gap-2'>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPPp")
                                  ) : (
                                    <span>Selecione a data e hora</span>
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
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0, 0, 0, 0))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <Input
                            type="time"
                            className='w-24'
                            value={field.value ? format(field.value, "HH:mm") : ""}
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value.split(":").map(Number);
                              const newDate = new Date(field.value || new Date());
                              newDate.setHours(hours, minutes);
                              field.onChange(newDate);
                            }}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 
                  <FormField 
                    name='motivo'
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className='flex flex-col justify-center w-full max-w-lg items-start gap-1.5'>
                            <Label htmlFor='senha'>Motivo</Label>
                            <div className='flex justify-center items-center'>
                              <Textarea {...field} className='flex max-h-40 w-80 overflow-auto' />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
            <div className='flex flex-col mt-2'>
              <div className='flex w-full mt-4 justify-evenly items-center'>
                <Button variant={'outline'} type='submit' className='bg-[var(--background-azul)] hover:bg-[var(--background-hover-azul)]'>Cadastrar</Button>
                <Button variant={'outline'} type='button' onClick={cancel}>Cancelar</Button>
              </div>
            </div>
          </div>
        </form>
      </Form>

    </div>
  )
}

export default FormIndisponivelUser
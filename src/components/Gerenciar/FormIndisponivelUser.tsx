'use client'

import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { z } from 'zod'
import { format } from "date-fns"
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { IMaskInput } from 'react-imask'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { cn } from '@/lib/utils'


const schema = z.object({
  startTime: z.date({required_error: "A date of birth is required."}),
  endTime: z.date({required_error: "A date of birth is required."}),
  motivo: z.string().optional()
})

interface FormIndisponivelUserProps {
  onSubmit: (data:any) => void
  cancel: () => void
  id: string
}

const FormIndisponivelUser = ({ onSubmit, cancel, id }:FormIndisponivelUserProps) => {

  const form = useForm({
    resolver: zodResolver(schema)
  })


  const handleSubmit = (data:z.infer<typeof schema>) => {
    console.log(data)
    const body = {
      "dataInicio": data.startTime,
      "dataFim": data.endTime,
      "motivo": data.motivo
    }
    onSubmit( id , body)
  }

  console.log(form.watch('startTime'))

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
                        <FormLabel>Date of birth</FormLabel>
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
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
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
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Your date of birth is used to calculate your age.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                      
                    )}
                  />
                  {/* <FormField 
                    name='endTime'
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className='flex flex-col justify-center w-full max-w-lg items-start gap-1.5'>
                            <Label htmlFor='date'>Data Final</Label>
                            <Input {...field} id='date' type="date" />
                          </div>
                        </FormControl>
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
                            <Input {...field} id='senha' type="password" placeholder='Senha' title='Senha' />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
                  /> */}
              </div>

            <div className='flex flex-col mt-2'>
              <div className='flex w-full mt-4 justify-evenly items-center'>
                <Button variant={'outline'} type='submit'>Cadastrar</Button>
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
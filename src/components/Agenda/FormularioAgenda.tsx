"use client"

import { Input } from '../ui/input'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { IMaskInput } from "react-imask"
import { useCurrentCliente } from '../hooks/PageContext'
import { useEffect } from 'react'
import { getDate, getHours, getMinutes, getMonth, getYear, parseISO } from 'date-fns'
import { UseFormReturn } from 'react-hook-form'
import { FormSchema } from './AgendaCliente'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'

interface FormularioAgendaProps {
  form: UseFormReturn<z.infer<typeof FormSchema>>
  date: Date | null
  onSubmit: (data: z.infer<typeof FormSchema>) => void
  cancel?: () => void
  loading: boolean
  horaAgendamento: string
}

const FormularioAgenda = ({form, date, loading, horaAgendamento, onSubmit, cancel}: FormularioAgendaProps) => {
  const { cliente } = useCurrentCliente()
  
  if(!date) return
  
  const isoDate = new Date(horaAgendamento);
  const month = getMonth(isoDate) + 1; // getMonth retorna 0-11, então adicionamos 1
  const day = getDate(isoDate);
  const hours = getHours(isoDate);
  const minutes = getMinutes(isoDate);
  
  useEffect(() => {
      if(cliente) {
          form.setValue('Cliente.nome', cliente)
      }
      // form.setValue('email', "eliabe.gai@email.com")
      // form.setValue('telefone', "47992082307")
      form.setValue('dataHora', isoDate)
      // form.setValue('protocolo', "516165168")
  },[])

  return(
    <div>
      <div className='flex border-b-4 border-[var(--background-azul)] px-4 pt-1 pb-3 justify-center items-center'>
          <span className='text-5xl font-thin'>{`${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')} - ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}h`}</span>
      </div>
      <div className='mt-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
            <FormField
              control={form.control} 
              name="Cliente.nome"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <div className='space-y-2'>
                      <FormLabel>Nome</FormLabel>
                      <Input type='string' title='Nome' placeholder='Nome' {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control} 
              name="Cliente.email"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <div className='space-y-2'>
                      <FormLabel>Email</FormLabel>
                      <Input type='email' title='Email' placeholder='email@email.com' {...field}/>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control} 
              name="Cliente.telefone"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <div className='space-y-2'>
                      <FormLabel>Telefone</FormLabel>
                      <IMaskInput
                        mask="(00) 0 0000-0000"
                        placeholder="(99) 9 9999-9999"
                        value={field.value}
                        onAccept={(value) => field.onChange(value)}
                        className="w-full p-2 border rounded-md"
                        name={field.name}
                        id={field.name}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control} 
              name="Cliente.protocolo"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <div className='space-y-2'>
                      <FormLabel>Protocolo</FormLabel>
                      <Input type='text' title='Protocolo' placeholder='Protocolo' {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex w-full justify-center items-center space-x-4'>
              <Button variant={'outline'} disabled={loading} type='submit' size={'lg'} className='bg-[var(--background-azul)] hover:bg-[(var(--background-hover-azul)] w-36' >
                {loading && <Loader2 className='animate-spin' />}
                Agendar
              </Button>
              <Button type='button' variant={'outline'} size={'lg'} className='w-36' onClick={cancel} >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default FormularioAgenda
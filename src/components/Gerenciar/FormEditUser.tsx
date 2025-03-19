'use client'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { IMaskInput } from 'react-imask'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'


const schema = z.object({
  nome: z.string().nonempty('Nome é obrigatório'),
  email: z.string().email('Email inválido').nonempty('Email é obrigatório'),
  // senha: z.string().min(5,{message: "Mínimo 5 caracteres"}),
  role: z.string().nonempty('Cargo é obrigatório'),
  horarios: z.array(
    z.object({
      diaSemana: z.number(),
      id: z.string().optional(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      breakStart: z.string().optional(),
      breakEnd: z.string().optional(),
      active: z.boolean().default(false).optional()
    })
  )
})

interface FormUserProps {
  onSubmit: (id:string, body:any) => void
  cancel: () => void
  userData: IFuncionario | null
}

const FormEditUser = ({ onSubmit, cancel, userData }:FormUserProps) => {

  if(userData === null) return

  const [repeatHorarios, setRepeatHorarios] = useState<boolean>(false)
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: '',
      email: '',
      role: 'USER',
      // senha: '',
      horarios: [
        { diaSemana: 1, id: '', startTime: '', breakStart: '', breakEnd: '', endTime: '', active: false },
        { diaSemana: 2, id: '', startTime: '', breakStart: '', breakEnd: '', endTime: '', active: false },
        { diaSemana: 3, id: '', startTime: '', breakStart: '', breakEnd: '', endTime: '', active: false },
        { diaSemana: 4, id: '', startTime: '', breakStart: '', breakEnd: '', endTime: '', active: false },
        { diaSemana: 5, id: '', startTime: '', breakStart: '', breakEnd: '', endTime: '', active: false },
        { diaSemana: 6, id: '', startTime: '', breakStart: '', breakEnd: '', endTime: '', active: false }
      ]
    }
  })

  const handleRepeatHorarios = () => {
    setRepeatHorarios(!repeatHorarios)
    if (!repeatHorarios) {
      const firstHorario = form.watch('horarios')[0]
      if(!firstHorario.active) return
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
        form.setValue(`horarios.${i}.startTime`, '')
        form.setValue(`horarios.${i}.breakStart`, '')
        form.setValue(`horarios.${i}.breakEnd`, '')
        form.setValue(`horarios.${i}.endTime`, '')
      }
    }
  }

  const handleSubmit = (data:z.infer<typeof schema>) => {
    const body = {
      "nome": data.nome,
      "email": data.email,
      // "senha": data.senha,
      "role": data.role,
      "horarios": data.horarios
    }
    onSubmit(userData.id, body)
  }

  const preencherDados = (user: IFuncionario) => {
    form.setValue('nome', user.nome)
    form.setValue('email', user.email)
    form.setValue('role', user.role)

    const horarios = user.horarios

    for(let i = 0; i < 6; i++) {

      if(horarios[i]?.startTime !== undefined) {
        form.setValue(`horarios.${i}.active`, true)
        form.setValue(`horarios.${i}.id`, horarios[i]?.id)
        form.setValue(`horarios.${i}.startTime`, horarios[i]?.startTime)
        form.setValue(`horarios.${i}.breakStart`, horarios[i]?.breakStart)
        form.setValue(`horarios.${i}.breakEnd`, horarios[i]?.breakEnd)
        form.setValue(`horarios.${i}.endTime`, horarios[i]?.endTime)
      } else {
          form.setValue(`horarios.${i}.active`, false)
          form.setValue(`horarios.${i}.startTime`, '')
          form.setValue(`horarios.${i}.breakStart`, '')
          form.setValue(`horarios.${i}.breakEnd`, '')
          form.setValue(`horarios.${i}.endTime`, '')
        }
    }
  }

  useEffect(() => {
    preencherDados(userData)
  },[userData])

  return(
    <div className='flex flex-col w-full h-full justify-center items-center p-2'>
      <div className='flex flex-col w-full justify-center items-center'>
          <h2 className='text-3xl font-bold mb-4'>Editar Funcionário</h2>
          <div className='flex w-full h-2 bg-[var(--background-azul)] rounded-lg'></div>
      </div>
      <Form {...form} >
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className='flex flex-col space-y-2 mt-4'>
              <div className='flex flex-col w-full space-y-2 p-2'>
                <div className='flex w-full items-start space-x-2'>
                  <FormField
                    name='nome'
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className='flex-[3]'>
                        <FormControl>
                          <div className='flex flex-col justify-center w-full max-w-lg items-start gap-1.5'>
                            <Label htmlFor='nome'>Nome</Label>
                            <Input {...field} id='nome' type="text" placeholder='Nome' title='Nome' autoFocus />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                      
                    )}
                  />

                  <FormField 
                    name='role'
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className='flex-[1]'>
                        <FormControl>
                          <div className='flex flex-col justify-center w-full max-w-lg items-start gap-1.5'>
                            <Label htmlFor='email'>Cargo</Label>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className='flex w-full'>
                                <SelectValue placeholder="Cargo" />
                              </SelectTrigger>
                              <SelectContent className='flex w-full'>
                                <SelectItem value='USER'>User</SelectItem>
                                <SelectItem value='ADMIN'>Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                  <FormField 
                    name='email'
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className='flex flex-col justify-center w-full max-w-lg items-start gap-1.5'>
                            <Label htmlFor='email'>Email</Label>
                            <Input {...field} id='email' type="email" placeholder='Email' title='Email' />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
                  />
                  
                  {/* <FormField 
                    name='senha'
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className='flex flex-col justify-center w-full max-w-lg items-start gap-1.5'>
                            <Label htmlFor='senha'>Senha</Label>
                            <Input {...field} id='senha' type="password" placeholder='Senha' title='Senha' />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
                  /> */}
              </div>

            <div className='flex flex-col mt-2'>
              <span>Selecione os dias da semana que irá trabalhar</span>
              <div className='flex w-full justify-end items-center gap-2'>
                <span>Repetir horários</span>
                <Checkbox checked={repeatHorarios} onClick={handleRepeatHorarios} className='size-5' /> 
              </div>

              <div className='flex flex-col max-h-64 overflow-auto mt-4'>
                { form.watch('horarios')?.map((_, index) => (
                  <div key={index} className='flex justify-center items-end space-x-2 p-1'>
                    <div className='flex flex-col justify-center items-center p-1 space-y-1'>
                      <span className='text-sm'>{['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'][index]}</span>
                      <FormField
                        name={`horarios.${index}.active`}
                        control={form.control}
                        render={({ field }) => (
                          <Checkbox 
                            {...field}
                            className='size-5'
                            id={`horarios.${index}.active`}
                            value={'check'}
                            checked={field.value}
                            onCheckedChange={(e) => {
                              field.onChange(e);
                              if (!e) {
                                form.setValue(`horarios.${index}.startTime`, '')
                                form.setValue(`horarios.${index}.breakStart`, '')
                                form.setValue(`horarios.${index}.breakEnd`, '')
                                form.setValue(`horarios.${index}.endTime`, '')
                              }
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className='grid grid-cols-4 justify-around items-center gap-4'>
                      <FormField
                        name={`horarios.${index}.startTime`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <IMaskInput
                              mask="00:00"
                              placeholder="00:00"
                              value={field.value}
                              onAccept={(value) => field.onChange(value)}
                              disabled={!form.watch(`horarios.${index}.active`)}
                              className="w-full p-2 border rounded-md text-center"
                              name={field.name}
                              id={field.name}
                            />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name={`horarios.${index}.breakStart`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <IMaskInput
                              mask="00:00"
                              placeholder="00:00"
                              value={field.value}
                              onAccept={(value) => field.onChange(value)}
                              disabled={!form.watch(`horarios.${index}.active`)}
                              className="w-full p-2 border rounded-md text-center"
                              name={field.name}
                              id={field.name}
                            />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name={`horarios.${index}.breakEnd`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <IMaskInput
                              mask="00:00"
                              placeholder="00:00"
                              value={field.value}
                              onAccept={(value) => field.onChange(value)}
                              disabled={!form.watch(`horarios.${index}.active`)}
                              className="w-full p-2 border rounded-md text-center"
                              name={field.name}
                              id={field.name}
                            />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name={`horarios.${index}.endTime`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <IMaskInput
                              mask="00:00"
                              placeholder="00:00"
                              value={field.value}
                              onAccept={(value) => field.onChange(value)}
                              disabled={!form.watch(`horarios.${index}.active`)}
                              className="w-full p-2 border rounded-md text-center"
                              name={field.name}
                              id={field.name}
                            />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className='flex w-full mt-4 justify-evenly items-center gap-3'>
                <Button variant={'outline'} className='w-1/2 bg-[var(--background-azul)] hover:bg-[var(--background-hover-azul)]' type='submit'>Salvar</Button>
                <Button variant={'outline'} type='button' className='w-1/2' onClick={cancel}>Cancelar</Button>
              </div>
            </div>
          </div>
        </form>
      </Form>

    </div>
  )
}

export default FormEditUser
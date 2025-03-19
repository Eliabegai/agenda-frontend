'use client'

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner';
import Image from 'next/image';
import imagem from '../../assets/image.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { ModeToggle } from '@/components/ModeToggle/modeToggler';
import Link from 'next/link';
import { useEffect } from 'react';
import { useCurrentAdminOrUser } from '@/components/hooks/PageContext';
import decodeToken, { IToken } from '@/components/hooks/decodeToken';

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  nome: z.string().optional(),
  password: z.string().min(5,{message: "Mínimo 5 caracteres"})
})

export default function Agenda() {

  const router = useRouter()
  const url = process.env.NEXT_PUBLIC_API_URL

  const { setEmail, setNome, setRole, setId, getToken, saveToken, getUserData, Login } = useCurrentAdminOrUser()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      nome: "",
      password: ""
    }
  })
  const { errors } = form.formState

  useEffect(() => {
    const token = getToken()
    if(token) {
      const userData = getUserData()
      if(userData) {
        setNome(userData?.nome)
        setRole(userData?.role)
        setEmail(userData?.email)
        setId(userData?.id)
      }
    }
  }, []);

  const saveInStorage = (nome: string, role: string, email:string, id:string, token: string) => {
    const storageItens = { 'user': nome, 'role': role, 'email': email, 'id': id }
    if (typeof window !== "undefined") {
      localStorage.setItem('user', JSON.stringify(storageItens))
      saveToken(token)
    }
  }

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {

    const body = {
      "email": data.email,
      "senha": data.password
    }

    const response: ILogin | null = await Login(body)
    if(!response) return

    if(typeof response.access_token === "string") {
      const token = response?.access_token
      const decoded: IToken | null = decodeToken(token)
      
      if(decoded) {
        setNome(decoded?.username)
        setRole(decoded?.role)
        setEmail(decoded?.email)
        setId(decoded?.id)
        saveInStorage(decoded?.username, decoded?.role, decoded?.email, decoded?.id, token)
      }
  
      toast.success("Bem Vindo!", {
        description: (
          <div>
            <h3>{decoded?.username}</h3>
          </div>
        )
      })
      router.push('/agenda')
    } else {
      toast.error('Usuário ou Senha incorretos!')
    }

  }

  return (
    <div className='flex flex-col m-auto p-2 w-full h-screen justify-center items-center'>
      <div className='fixed right-3 top-2'><ModeToggle/></div>
      <div className='flex flex-row w-full max-w-[1440px] h-full md:h-full justify-center items-center p-5'>
        <div className='w-1/2 h-full md:flex hidden relative rounded-l-2xl'>
          <Link href={'/agenda'}>
            <Image src={imagem} alt='agenda' fill quality={75} className='w-1/2 dark:brightness-75' />
          </Link>
        </div>

        <div className='flex flex-col w-full h-full md:flex-1 max-w-xl p-8 justify-center items-center space-y-5 rounded-r-xl shadow-lg'>
          <Link href='/agenda' className='shadow-inner'>
              <h1 className='text-3xl font-bold'>Agenda de Trabalho</h1>
          </Link>
          <div className='flex w-full h-full justify-center items-center p-10'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full' >
                <FormField
                  control={form.control} 
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Login</FormLabel>
                      <FormControl>
                        <div className='flex space-x-2 items-center'>
                          <Input placeholder='email@email.com' type='text' {...field} />
                          {
                              !errors.email ? (
                                <FontAwesomeIcon 
                                    icon={faCheck} 
                                    data-value={!!field.value} 
                                    className='data-[value=true]:text-green-800' 
                                />
                              ) : (
                                <FontAwesomeIcon 
                                    icon={faXmark} 
                                    data-error={!errors?.email} 
                                    className='data-[error=true]:text-red-600' 
                                />
                              )
                            }
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={form.control} 
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                                <div className='flex space-x-2 items-center'>
                                    <Input placeholder='Senha' type='password' {...field} />
                                    {
                                          !errors.password ? (
                                            <FontAwesomeIcon 
                                                icon={faCheck} 
                                                data-value={!!field.value} 
                                                className='data-[value=true]:text-green-800' 
                                            />
                                        ) : (
                                            <FontAwesomeIcon 
                                                icon={faXmark} 
                                                data-error={!errors?.email} 
                                                className='data-[error=true]:text-red-600' 
                                            />
                                        )
                                    }
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit' className='bg-(--background-azul) hover:bg-(--background-hover-azul) text-white hover:text-zinc-100 font-normal' variant={'outline'} >Submit</Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

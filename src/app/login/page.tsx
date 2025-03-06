'use client'

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner';
import Image from 'next/image';
import agenda from '../../assets/agenda.webp'
import imagem from '../../assets/image.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { ModeToggle } from '@/components/ModeToggle/modeToggler';

const FormSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(5,{message: "Mínimo 5 caracteres"})
})
export default function Agenda() {

    const router = useRouter()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })
    const { errors } = form.formState

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        toast.success("Bem Vindo!", {
            description: (
                <div>
                    <h3>{data?.email}</h3>
                </div>
            )
        })
        router.push('/agenda')
    }

    return (
        <div className='flex flex-col m-auto p-2 w-full h-screen justify-center items-center'>
            <div className='fixed right-3 top-2'><ModeToggle/></div>
            <div className='flex flex-row w-full max-w-[1440px] h-full md:h-full justify-center items-center p-5'>
                <div className='w-1/2 h-full md:flex hidden relative rounded-l-2xl'>
                    <Image src={imagem} alt='agenda' fill quality={75} className='w-1/2' />
                </div>

                <div className='flex flex-col w-full h-full md:flex-1 max-w-xl p-8 justify-center items-center space-y-5 rounded-r-xl shadow-lg'>
                    <h1 className='text-3xl font-bold'>Agenda de Trabalho</h1>
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

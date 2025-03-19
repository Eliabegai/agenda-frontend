
import Pagina from '@/components/Template/Pagina';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import imagem from '../assets/image.png'

export default function Home() {
  redirect("/agenda")
  return(
    <Pagina>
      <Image src={imagem} alt='Agenda' />
    </Pagina>
  )
}

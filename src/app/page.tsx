'use client'
import Pagina from '@/components/Template/Pagina';
import { ModeToggle } from '@/components/ModeToggle/modeToggler';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/agenda')
  },[])

  return (
    <Pagina>
      <div>
        <h1>Agenda</h1>
        <ModeToggle />
      </div>
    </Pagina>
  );
}

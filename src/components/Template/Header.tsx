"use client";

import { faCalendarDays, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { ModeToggle } from '../ModeToggle/modeToggler';
import { useRouter } from 'next/navigation';
import { useCurrentAdminOrUser } from '../hooks/PageContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const { getToken, Logout } = useCurrentAdminOrUser()
  const router = useRouter()
  const [token, setToken] = useState<string|null>(null)
  
  useEffect(() => {
    const response = getToken()
    setToken(response)
  },[])
  const handleLogin = () => {
    router.push('/login')
  }
  
  const handleLogout = () => {
    Logout()
    router.push('/login')
  }

  return(
    <header className="flex border-b-2 px-4 pt-4 pb-1 justify-between items-center">
      <div className='text-2xl'>
        <Link href={'/agenda'} className='flex justify-center items-center space-x-2'>
          <FontAwesomeIcon icon={faCalendarDays} color='(--background-azul)' />
          <h1 className='text-3xl font-bold'>Agenda de Trabalho</h1>
        </Link>
      </div>
      <div className='space-x-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <FontAwesomeIcon icon={faUser} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={token ? handleLogout :handleLogin}>{token ? "Logout" : "Login"}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert('Editar Perfil')}>Editar Perfil</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ModeToggle />
      </div>
    </header>
  )
}

export default Header
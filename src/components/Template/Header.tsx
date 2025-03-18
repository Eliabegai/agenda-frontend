"use client";

import { faCalendarDays, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { ModeToggle } from '../ModeToggle/modeToggler';
import { useRouter } from 'next/navigation';
import { useCurrentAdminOrUser } from '../hooks/PageContext';
import { useState } from 'react';
import Link from 'next/link';
import EmployeeEditForm from '../EditarPerfil/Settings';

const Header = () => {
  const router = useRouter()
  const { getToken, Logout } = useCurrentAdminOrUser()
  const [open, setOpen] = useState<boolean>(false)
  const token = getToken()
  
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

      <EmployeeEditForm open={open} setOpen={() => setOpen(!open)} />

      <div className='space-x-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <FontAwesomeIcon icon={faUser} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={token ? handleLogout : handleLogin}>{token ? "Logout" : "Login"}</DropdownMenuItem>
            {token &&
              <DropdownMenuItem onClick={() => setOpen(!open)}>Editar Perfil</DropdownMenuItem>
            }
          </DropdownMenuContent>
        </DropdownMenu>
        <ModeToggle />
      </div>
    </header>
  )
}

export default Header
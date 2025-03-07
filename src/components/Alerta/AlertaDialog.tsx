import { ReactNode } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import { Button } from '../ui/button'

interface AlertaDialogProps {
    open: boolean
    setOpen?: (open: boolean) => void
    title?: string
    children: ReactNode
    cancel?: () => void
    action?: () => void
    description?: string
}

const AlertaDialog = ({open, setOpen, title, children, cancel, action, description}:AlertaDialogProps) => {
    return(
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                    <div>
                        {children}
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <div data-footer={!!cancel && !!action} className='flex w-full justify-center items-center space-x-4 data-[footer=false]:hidden'>
                        <Button variant={'outline'} type='submit' size={'lg'} className='bg-[var(--background-azul)] hover:bg-[(var(--background-hover-azul)] w-36' onClick={action}>Continue</Button>
                        <Button variant={'outline'} size={'lg'} className='w-36' onClick={cancel}>Cancel</Button>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default AlertaDialog
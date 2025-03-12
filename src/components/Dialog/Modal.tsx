import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'

interface ModalProps {
    children: React.ReactNode
    labelOpen?: React.ReactNode
    title?: string
    description?: string
    closeFooter?: boolean
    open?: boolean
    openChange: () => void
}


export function Modal({children, labelOpen, title, description, closeFooter, open, openChange}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={openChange}>
      <DialogTrigger asChild>
        {labelOpen}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
          {children}
        <DialogFooter hidden={closeFooter} className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

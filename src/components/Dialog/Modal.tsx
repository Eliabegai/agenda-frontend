import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'

interface ModalProps {
    children: React.ReactNode
    labelOpen: React.ReactNode
    title?: string
    description?: string
    close: boolean
}


export function Modal({children, labelOpen, title, description, close}: ModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {labelOpen}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
            {children}
        <DialogFooter hidden={close} className="sm:justify-start">
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

"use client"
import { Trash2, TriangleAlert, UserCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  funcionario: IFuncionario| null
  onDelete: (id: string) => void
}

export function DeleteConfirmationDialog({ open, onOpenChange, funcionario, onDelete }: DeleteConfirmationDialogProps) {
  if (!funcionario) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md p-0 overflow-hidden border-none shadow-lg">
        <div className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-destructive to-destructive/70" />

          <div className="bg-destructive/5 p-6 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
              <TriangleAlert className="h-12 w-12 text-destructive animate-pulse" />
            </div>
            <AlertDialogHeader className="space-y-2 text-center">
              <AlertDialogTitle className="text-2xl font-bold">Excluir funcionário</AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                Você está prestes a excluir permanentemente este funcionário. Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>

          <div className="p-6 space-y-6">
            <div className="rounded-lg border bg-card p-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Funcionário</span>
                <div className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium text-lg">{funcionario.nome}</span>
                </div>
              </div>
            </div>

            <AlertDialogFooter className="flex-row gap-3 p-0">
              <AlertDialogCancel className="mt-0 w-1/2" onClick={() => onOpenChange(false)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                className="mt-0 w-1/2 bg-destructive hover:bg-destructive/90 group"
                onClick={() => onDelete(funcionario.id)}
              >
                <Trash2 className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                <span>Excluir</span>
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
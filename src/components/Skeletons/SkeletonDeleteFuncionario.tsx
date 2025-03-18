import { AlertTriangle, UserCircle } from "lucide-react";
import { Skeleton } from '../ui/skeleton';

export default function SkeletonDeleteFuncionario() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-destructive to-destructive/70" />

      <div className="bg-destructive/5 p-4 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-12 w-12 text-destructive animate-pulse" />
        </div>
        <div className="space-y-2 text-center">
          <div className="text-2xl font-bold">
            <Skeleton className="h-6 w-40 mx-auto" />
          </div>
          <div className="text-sm">
            <Skeleton className="h-4 w-60 mx-auto" />
            <Skeleton className="h-4 w-52 mx-auto mt-1" />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Funcionário
            </span>
            <div className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-muted-foreground" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Skeleton className="h-10 w-1/2 rounded-md" />
          <Skeleton className="h-10 w-1/2 rounded-md bg-destructive/80" />
        </div>
      </div>
    </div>
  );
}

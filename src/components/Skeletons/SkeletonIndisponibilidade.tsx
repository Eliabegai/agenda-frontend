import { Skeleton } from '../ui/skeleton';

export function SkeletonIndisponibilidadeItem() {
  return (
    <div className="flex justify-between items-center p-4 border rounded-md">
      <div className="flex-1">
        <div className="font-medium">
          <Skeleton className="h-5 w-[250px]" />
        </div>
        <div className="mt-1">
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="h-9 w-9 rounded-md bg-transparent flex items-center justify-center">
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  )
}
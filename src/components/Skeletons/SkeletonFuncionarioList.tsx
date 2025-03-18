import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';

export default function SkeletonFuncionariosList() {
  return (
    <div className="flex flex-col w-full h-full p-4">
      <ScrollArea className="h-96">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-md space-y-4">
              <div className='flex flex-coljustify-start gap-4'>
                <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                <Skeleton className="h-6 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </div>
              <div className="flex justify-end gap-2">
                <Skeleton className="h-8 w-16 rounded-md" />
                <Skeleton className="h-8 w-16 rounded-md" />
                <Skeleton className="h-8 w-16 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

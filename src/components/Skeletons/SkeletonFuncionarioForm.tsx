import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';

export default function SkeletonFuncionarioForm() {
  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          <Skeleton className="h-6 w-48 mx-auto" />
        </CardTitle>
        <Separator className="h-1 bg-primary rounded-lg" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-6 w-6 rounded" />
            </div>

            <div className="border rounded-md p-4 max-h-64 overflow-auto space-y-3">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="grid grid-cols-[auto_1fr] gap-4">
                  <Skeleton className="h-5 w-20" />
                  <div className="grid grid-cols-4 gap-2">
                    <Skeleton className="h-10 w-full rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row w-full justify-center gap-4 pt-4 px-0">
        <Button className="w-32" disabled>
          <Skeleton className="h-5 w-full" />
        </Button>
        <Button variant="outline" className="w-32" disabled>
          <Skeleton className="h-5 w-full" />
        </Button>
      </CardFooter>
    </Card>
  );
}

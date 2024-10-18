import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="flex min-h-[100svh] flex-col space-y-4 p-4 md:items-center">
      <Skeleton className="h-4 md:w-[250px] mr-[9.5rem]" />

      <Skeleton className="h-[400px] md:w-[400px]" />

      <Skeleton className="h-20 md:w-[400px]" />

      <Skeleton className="h-[400px] md:w-[400px]" />

      <Skeleton className="h-32 md:w-[400px] " />
      <div className="h-[65px]"></div>
    </main>
  );
}

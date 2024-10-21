import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="mb-20 flex h-[100svh] flex-col p-4 pt-20 md:mx-auto md:w-[500px]">
      <Skeleton className="w-[190px] mb-20 h-[190px] rounded-full self-center aspect-square" />

      <div className="flex flex-col items-center self-center w-full gap-6">
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-full h-8" />

        <Skeleton className="w-full h-8" />
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-full h-8" />
      </div>
    </div>
  );
}

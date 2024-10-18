import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingMessages() {
  return (
    <div className="flex h-[100svh] flex-col md:mx-auto md:w-[700px]">
      <h1 className="self-start w-full p-6"></h1>
      <Separator />
      <div className="flex items-center w-full gap-4 p-4">
        <Skeleton className="w-20 h-20 rounded-full  aspect-square" />
        <div className="w-4/5 ">
          <Skeleton className="w-1/2 h-4 mb-4 " />
          <Skeleton className="h-4 " />
        </div>
      </div>
      {/* <div className="flex items-center w-full gap-4 p-4">
        <Skeleton className="w-20 h-20 rounded-full  aspect-square" />
        <div className="w-4/5 ">
          <Skeleton className="w-1/2 h-4 mb-4 " />
          <Skeleton className="h-4 " />
        </div>
      </div>
      <div className="flex items-center w-full gap-4 p-4">
        <Skeleton className="w-20 h-20 rounded-full  aspect-square" />
        <div className="w-4/5 ">
          <Skeleton className="w-1/2 h-4 mb-4 " />
          <Skeleton className="h-4 " />
        </div>
      </div> */}
    </div>
  );
}

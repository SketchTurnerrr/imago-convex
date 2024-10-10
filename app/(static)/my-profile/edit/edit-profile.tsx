'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { GoBackBtn } from '@/components/go-back-btn';
import { Separator } from '@/components/ui/separator';
import { Preloaded, useMutation, usePreloadedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { PhotoManager } from '@/components/photo-manager';
import { CreatePromptDialog } from '@/components/create-prompt';

export function EditProfilePage({
  preloadedProfilePhotos,
  preloadedProfilePrompts,
}: {
  preloadedProfilePhotos: Preloaded<typeof api.myFunctions.getUserPhotos>;
  preloadedProfilePrompts: Preloaded<typeof api.myFunctions.getUserPrompts>;
}) {
  const router = useRouter();

  const prompts = usePreloadedQuery(preloadedProfilePrompts);
  const deletePrompt = useMutation(api.myFunctions.deletePrompt);

  return (
    <div className="h-[100svh] p-4 md:mx-auto md:h-auto md:w-[500px]">
      <div className="flex items-center gap-3 mb-4">
        <GoBackBtn />
        <h1 className="text-3xl font-bold">Редагувати</h1>
      </div>
      <Separator className="bg-slate-300" />
      <h2 className="mx-auto my-4 text-2xl font-bold">Фото</h2>
      <span className="text-sm md:hidden">
        натисніть на фото, щоб зробити його головним
      </span>
      <PhotoManager onComplete={() => {}} />
      <div className="flex flex-col gap-4 pb-20 md:pb-10">
        <h2 className="mt-10 text-2xl font-bold">Фрази</h2>
        {prompts.map((prompt) => {
          return (
            <div
              key={prompt._id}
              className="relative flex flex-col p-4 text-sm font-bold border border-gray-100 rounded-lg shadow-sm bg-slate-50 dark:border-none dark:bg-secondary"
            >
              <p>{prompt.question}</p>
              <p className="mt-2 font-normal text-slate-500">{prompt.answer}</p>
              <div
                onClick={() => deletePrompt({ promptId: prompt._id })}
                role="button"
                className="absolute p-1 bg-white rounded-full shadow-md -right-1 -top-1"
              >
                <Image src="/x.svg" width={14} height={14} alt="close icon" />
              </div>
            </div>
          );
        })}
        {prompts.length < 3 && <CreatePromptDialog />}
      </div>
    </div>
  );
}

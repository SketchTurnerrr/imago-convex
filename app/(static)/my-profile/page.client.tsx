'use client';

import { api } from '@/convex/_generated/api';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import Image from 'next/image';
import Link from 'next/link';
import { GearIcon, Pencil2Icon } from '@radix-ui/react-icons';
import { BadgeIcon, HeartHandshake, LogOut } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { ThemeChanger } from '@/components/theme-changer';
import { Button } from '@/components/ui/button';

export default function MyProfile({
  preloadedProfile,
  preloadedProfilePhoto,
}: {
  preloadedProfile: Preloaded<typeof api.profiles.current>;
  preloadedProfilePhoto: Preloaded<typeof api.myFunctions.getUserPhotos>;
}) {
  const profile = usePreloadedQuery(preloadedProfile);
  const photo = usePreloadedQuery(preloadedProfilePhoto);

  if (preloadedProfile === undefined) {
    return <div>Loading...</div>;
  }

  if (preloadedProfile === null) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="mb-20 flex h-[100svh] flex-col p-4 pt-20 md:mx-auto md:w-[500px]">
      <Image
        priority
        src={Array.isArray(photo) ? photo[0]?.url : photo?.url || ''}
        alt={'photo'}
        width={190}
        height={190}
        className="self-center object-cover mb-6 rounded-full aspect-square"
      />
      <div className="flex items-center self-center gap-3">
        <h1 className="text-4xl font-bold capitalize">{profile.name}</h1>

        {profile.verified && (
          <Popover>
            <PopoverTrigger>
              <BadgeIcon
                className="self-end text-white"
                width={32}
                height={32}
              />
            </PopoverTrigger>
            <PopoverContent className="p-2 text-sm text-white border-none w-fit bg-secondary-foreground dark:bg-secondary">
              <p>Верифікований акаунт</p>
            </PopoverContent>
          </Popover>
        )}
      </div>
      {/* <Separator className="my-4 md:hidden" /> */}
      <Link className="mt-8 text-xl font-bold" href={'/my-profile/edit'}>
        <div className="flex items-center justify-between">
          Редагувати профіль
          <Button variant="ghost" size="icon">
            <Pencil2Icon className="h-7 w-7" />
          </Button>
        </div>
      </Link>

      {/* <Separator className="my-4" />
      <Link className="text-xl font-bold" href={"/my-profile/preferences"}>
        <div className="flex items-center justify-between">
          Уподобання
          <MixerHorizontalIcon className="h-7 w-7" />
        </div>
      </Link> */}
      <Separator className="my-4" />
      <Link className="text-xl font-bold" href={'/my-profile/account'}>
        <div className="flex items-center justify-between">
          Акаунт
          <Button variant="ghost" size="icon">
            <GearIcon className="h-7 w-7" />
          </Button>
        </div>
      </Link>
      {/*
      <Separator className="my-4" />
       <Link className="text-xl font-bold" href={"/my-profile/subscription"}>
        <div className="flex items-center justify-between">
          Підписка
          <SymbolIcon className="h-7 w-7" />
        </div>
      </Link> */}
      <Separator className="my-4" />
      <Link className="text-xl font-bold" href={'/my-profile/donate'}>
        <div className="flex items-center justify-between">
          Підтримати
          <Button variant="ghost" size="icon">
            <HeartHandshake className="h-7 w-7" />
          </Button>
        </div>
      </Link>
      <Separator className="my-4" />
      <div className="flex items-center justify-between text-xl font-bold">
        Тема
        <ThemeChanger />
      </div>
      <Separator className="my-4" />
      <div className="flex items-center justify-between text-xl font-bold">
        Вийти
        {/* <SignOutButton redirectUrl="/sign-in"> */}
        <Button variant="ghost" size="icon">
          <LogOut />
        </Button>
        {/* </SignOutButton> */}
      </div>
    </div>
  );
}

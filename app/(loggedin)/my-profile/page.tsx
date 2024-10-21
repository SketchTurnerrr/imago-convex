'use client';

import { api } from '@/convex/_generated/api';
import {
  Preloaded,
  Unauthenticated,
  useConvexAuth,
  usePreloadedQuery,
  useQuery,
} from 'convex/react';
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
import { useAuthActions } from '@convex-dev/auth/react';
import { useRouter } from 'next/navigation';

export default function MyProfile() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const router = useRouter();

  const profile = useQuery(
    api.users.getCurrentUser,
    isAuthenticated ? {} : 'skip'
  );
  const photo = useQuery(
    api.photos.getUserPhotos,
    isAuthenticated ? { single: false } : 'skip'
  );
  const { signOut } = useAuthActions();

  const handleSignOut = async () => {
    await signOut();
    router.push('/sign-in');
  };

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
        <h1 className="text-4xl font-bold capitalize">{profile?.name}</h1>

        {profile?.verified && (
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
        <Button onClick={handleSignOut} variant="ghost" size="icon">
          <LogOut />
        </Button>
      </div>
    </div>
  );
}

'use client';
import Image from 'next/image';
import Link from 'next/link';

import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { NavLink } from './nav-item';
import { Compass, MessageCircle, ThumbsUp } from 'lucide-react';
import { Doc } from '@/convex/_generated/dataModel';
import { useConvexAuth, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function Navbar() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  const userAvatar = useQuery(
    api.photos.getUserPhotos,
    isAuthenticated ? { single: true } : 'skip'
  );
  const router = useRouter();
  console.log('userAvatar :', userAvatar);

  const pathname = usePathname();

  const routes = useMemo(
    () => [
      {
        href: '/',
        icon: Compass,
        active: pathname === '/',
      },
      {
        href: '/likes',
        icon: ThumbsUp,
        active: pathname === '/likes',
      },
      {
        href: '/matches',
        icon: MessageCircle,
        active: pathname === '/matches',
      },
    ],
    [pathname]
  );

  // hide navbar on these routes
  if (pathname.split('/')[1] === 'matches' && pathname.split('/').length === 3)
    return null;

  if (pathname.split('/')[1] === 'donate') return null;

  return (
    <>
      <div className="fixed bottom-0 top-auto z-10 items-center w-full h-16 bg-slate-950 md:bottom-auto md:top-0 md:h-full md:w-16">
        <div className="absolute flex items-center justify-around w-full h-full md:mt-10 md:flex-col md:justify-start md:gap-10">
          {routes.map((route) => (
            <NavLink key={route.href} {...route} />
          ))}
          <Link href={'/my-profile'}>
            <Image
              priority
              className={'aspect-square rounded-full object-cover'}
              src={
                Array.isArray(userAvatar)
                  ? userAvatar[0].url
                  : userAvatar?.url || '/error-image.jpg'
              }
              width={30}
              height={30}
              alt="icon"
            />
          </Link>
        </div>
      </div>
    </>
  );
}

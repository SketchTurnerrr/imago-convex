'use client';
import { Navbar } from '@/components/navbar/navbar';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default function LayoutsLayout({ children }: { children: ReactNode }) {
  // const currentUser = useQuery(api.profiles.current);

  // const photos = useQuery(api.myFunctions.getUserPhotos, { single: false });

  // if (!photos) return null;

  return (
    <>
      {/* <Navbar userAvatar={Array.isArray(photos) ? photos[0] : undefined} /> */}
      {children}
    </>
  );
}

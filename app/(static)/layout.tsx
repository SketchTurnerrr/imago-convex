'use client';
import { Navbar } from '@/components/navbar/navbar';
import { api } from '@/convex/_generated/api';
import {
  Authenticated,
  Unauthenticated,
  useConvexAuth,
  useQuery,
} from 'convex/react';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';

export default function LayoutsLayout({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useCurrentUser();
  console.log('isAuthenticated :', isAuthenticated);

  if (!isLoading && isAuthenticated === false) {
    redirect('/sign-in');
  }

  return (
    <>
      <Authenticated>
        <Navbar />
        {children}
      </Authenticated>
      <Unauthenticated>{isLoading && <div>Loading...</div>}</Unauthenticated>
    </>
  );
}

'use client';
import { Navbar } from '@/components/navbar/navbar';
import { api } from '@/convex/_generated/api';
import { Authenticated, Unauthenticated, useQuery } from 'convex/react';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';

export default function LayoutsLayout({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useCurrentUser();
  console.log('isAuthenticated :', isAuthenticated);

  const currentUser = useQuery(api.users.getCurrentUser);
  console.log('currentUser :', currentUser);

  // Check if the currentUser has the onboarded property
  if (
    currentUser &&
    (currentUser.onboarded === false || currentUser.onboarded === undefined)
  ) {
    redirect('/onboarding'); // Redirect to onboarding page
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

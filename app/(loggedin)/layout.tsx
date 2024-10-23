'use client';
import { Navbar } from '@/components/navbar/navbar';
import { api } from '@/convex/_generated/api';
import { Authenticated, Unauthenticated, useQuery } from 'convex/react';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default function LayoutsLayout({ children }: { children: ReactNode }) {
  // Check if the currentUser has the onboarded property

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

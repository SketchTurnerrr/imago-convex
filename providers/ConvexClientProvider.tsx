'use client';
import { ConvexAuthNextjsProvider } from '@convex-dev/auth/nextjs';
import {
  Authenticated,
  AuthLoading,
  ConvexReactClient,
  Unauthenticated,
} from 'convex/react';

import { ReactNode } from 'react';

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || '';

const convex = new ConvexReactClient(CONVEX_URL);
const ConvexClientProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ConvexAuthNextjsProvider client={convex}>
      {children}
    </ConvexAuthNextjsProvider>
  );
};

export default ConvexClientProvider;

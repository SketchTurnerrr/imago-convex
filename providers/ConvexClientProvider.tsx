'use client';

import {
  Authenticated,
  AuthLoading,
  ConvexReactClient,
  Unauthenticated,
} from 'convex/react';
import { SignInButton, ClerkProvider, useAuth } from '@clerk/clerk-react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import React from 'react';
type Props = {
  children: React.ReactNode;
};
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || '';

const convex = new ConvexReactClient(CONVEX_URL);
const ConvexClientProvider = ({ children }: Props) => {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <Authenticated>{children}</Authenticated>
        <AuthLoading>
          <div>loading...</div>
        </AuthLoading>
        <Unauthenticated>
          <SignInButton />
        </Unauthenticated>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};

export default ConvexClientProvider;

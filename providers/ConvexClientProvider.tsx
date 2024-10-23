'use client';

import { dark } from '@clerk/themes';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ThemeProvider, useTheme } from 'next-themes';
import { SignInButton, ClerkProvider, useAuth } from '@clerk/clerk-react';
import {
  Authenticated,
  AuthLoading,
  ConvexReactClient,
  Unauthenticated,
} from 'convex/react';
import { SignIn } from '@/components/sign-in';
import { ukUA } from '@clerk/localizations';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  return (
    <ClerkProvider
      appearance={{
        baseTheme: resolvedTheme === 'dark' ? dark : undefined,
        signIn: { baseTheme: resolvedTheme === 'dark' ? dark : undefined },
        elements: {
          formFieldInput: 'bg-transparent',
        },
        variables: {
          colorPrimary: 'hsl(221, 83%, 53%)', // change this value (you can get it from you're css variables, make sure to include 'hsl' and commas)
        },
      }}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      localization={ukUA}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Authenticated>{children}</Authenticated>
          <Unauthenticated>
            <SignIn />
          </Unauthenticated>
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

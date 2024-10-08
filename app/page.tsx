'use client';

import { Button } from '@/components/ui/button';
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Code } from '@/components/typography/code';
import { Link } from '@/components/typography/link';
import { SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { StickyHeader } from '@/components/layout/sticky-header';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from 'next-themes';

export default function Home() {
  return (
    <>
      <StickyHeader className="px-4 py-2">
        <div className="flex items-center justify-between">
          Convex + Next.js + Clerk
          <SignInAndSignUpButtons />
        </div>
      </StickyHeader>
      <main className="container flex flex-col max-w-2xl gap-8">
        <h1 className="my-8 text-4xl font-extrabold text-center">
          Convex + Next.js + Clerk Auth
        </h1>
        <Authenticated>
          <SignedInContent />
        </Authenticated>
        <Unauthenticated>
          <p>Click one of the buttons in the top right corner to sign in.</p>
        </Unauthenticated>
      </main>
    </>
  );
}

function SignInAndSignUpButtons() {
  return (
    <div className="flex gap-4">
      <Authenticated>
        <UserButton afterSignOutUrl="#" />
      </Authenticated>
      <Unauthenticated>
        <SignInButton mode="modal">
          <Button variant="ghost">Sign in</Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button>Sign up</Button>
        </SignUpButton>
      </Unauthenticated>
    </div>
  );
}

function SignedInContent() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <>
      <p>Welcome {'N/A'}!</p>
      <Link href="/onboarding">
        <Button>Onboarding</Button>
      </Link>
      <p>
        Click the button below and open this page in another window - this data
        is persisted in the Convex cloud database!
      </p>

      <Link href="/my-profile">My profile</Link>
      <p>
        <Button onClick={toggleTheme}>toggle theme</Button>
      </p>

      <p>
        Edit <Code>convex/myFunctions.ts</Code> to change your backend
      </p>
      <p>
        Edit <Code>app/page.tsx</Code> to change your frontend
      </p>
      <p>
        Check out{' '}
        <Link target="_blank" href="https://docs.convex.dev/home">
          Convex docs
        </Link>
      </p>
      <p>
        To build a full page layout copy one of the included{' '}
        <Link target="_blank" href="/layouts">
          layouts
        </Link>
      </p>
    </>
  );
}

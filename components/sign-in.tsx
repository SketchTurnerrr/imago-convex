import { SignInButton } from '@clerk/clerk-react';

export function SignIn() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <p className="text-sm text-center">
        Sign in to your account to view your profile.
        <SignInButton />
      </p>
    </div>
  );
}

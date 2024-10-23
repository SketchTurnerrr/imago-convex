import './globals.css';
import type { Metadata } from 'next';
import { Lunasima, Ysabeau } from 'next/font/google';
import { TooltipProvider } from '@radix-ui/react-tooltip';

import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { ConvexClientProvider } from '@/providers/ConvexClientProvider';

// const lunasina = Lunasima({ subsets: ['cyrillic'], weight: ['400', '700'] });
const ysabeau = Ysabeau({ subsets: ['cyrillic'] });

export const metadata: Metadata = {
  title: 'My App Title',
  description: 'My app description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('h-[100svh]', ysabeau.className)}>
        <ConvexClientProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ConvexClientProvider>
        <Toaster />
      </body>
    </html>
  );
}

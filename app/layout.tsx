import './globals.css';
import type { Metadata } from 'next';
import { Lunasima, Ysabeau } from 'next/font/google';
import { TooltipProvider } from '@radix-ui/react-tooltip';

import ConvexClientProvider from '@/providers/ConvexClientProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { cn } from '@/lib/utils';
import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server';
import { Toaster } from '@/components/ui/toaster';

// const lunasina = Lunasima({ subsets: ['cyrillic'], weight: ['400', '700'] });
const ysabeau = Ysabeau({ subsets: ['cyrillic'] });
console.log('ysabeau :', ysabeau);

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
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn('h-[100svh]', ysabeau.className)}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ConvexClientProvider>
              <TooltipProvider>{children}</TooltipProvider>
              <Toaster />
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}

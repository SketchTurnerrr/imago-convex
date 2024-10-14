import './globals.css';
import type { Metadata } from 'next';
import { Lunasima } from 'next/font/google';
import { TooltipProvider } from '@radix-ui/react-tooltip';

import ConvexClientProvider from '@/providers/ConvexClientProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { cn } from '@/lib/utils';

const lunasina = Lunasima({ subsets: ['cyrillic'], weight: ['400', '700'] });

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
      <body className={cn('h-[100svh]', lunasina.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

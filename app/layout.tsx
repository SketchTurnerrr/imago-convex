import './globals.css';
import type { Metadata } from 'next';
import { Lunasima } from 'next/font/google';
import { TooltipProvider } from '@radix-ui/react-tooltip';

import ConvexClientProvider from '@/providers/ConvexClientProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

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
      <body className={lunasina.className}>
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

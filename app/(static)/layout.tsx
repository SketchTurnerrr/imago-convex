import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Onboarding',
  description: 'Onboarding page',
};

export default function LayoutsLayout({ children }: { children: ReactNode }) {
  return children;
}

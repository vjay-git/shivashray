'use client';

import { useSidebarStore } from '@/lib/store';

export function MainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebarStore();
  
  return (
    <main className={`flex-grow pt-20 sm:pt-24 lg:pt-0 transition-all duration-300 ${
      isCollapsed ? 'lg:pl-[88px]' : 'lg:pl-[296px]'
    }`}>
      {children}
    </main>
  );
}


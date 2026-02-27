'use client';

import { ReactNode } from 'react';
import { StoreClientProvider } from '@/app/(dashboard)/store-client/components/context';
import { StoreClientWrapper } from '@/app/(dashboard)/store-client/components/wrapper';

export function ModulesProvider({ children }: { children: ReactNode }) {
  return (
    <StoreClientProvider>
      <StoreClientWrapper>{children}</StoreClientWrapper>
    </StoreClientProvider>
  );
}

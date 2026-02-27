import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function BrandedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-[420px]">
        <CardContent className="p-6 sm:p-8">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
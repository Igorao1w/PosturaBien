import React from 'react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <span className="font-bold text-lg text-primary">PosturaBien</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} className="font-bold">
            ¡COMPRAR AHORA!
          </Button>
        </div>
      </div>
    </header>
  );
}

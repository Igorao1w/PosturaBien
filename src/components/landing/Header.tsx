import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-2 flex items-center gap-1">
           <Image
            src="https://i.postimg.cc/zfTmkRBd/Design-sem-nome-20250806-204948-0000.png"
            alt="PosturaBien Logo"
            width={50}
            height={50}
            className="h-14 w-auto"
          />
          <span className="hidden sm:inline-block font-bold text-lg text-primary-foreground">PosturaBien</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} className="font-bold text-center text-xs sm:text-sm px-2 sm:px-4">
            ¡PÍDELO HOY Y RECÍBELO EN CASA!
          </Button>
        </div>
      </div>
    </header>
  );
}

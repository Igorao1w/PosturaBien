import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onOrderNow: () => void;
}

export default function Header({ onOrderNow }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex flex-shrink-0 items-center gap-2">
           <Image
            src="https://i.postimg.cc/zfTmkRBd/Design-sem-nome-20250806-204948-0000.png"
            alt="PosturaBien Logo"
            width={50}
            height={50}
            className="h-14 w-auto"
          />
          <span className="font-bold text-lg text-primary-foreground">PosturaBien</span>
        </div>
        <div className="flex-1 flex justify-center">
          <Button 
            style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} 
            className="font-bold text-center text-xs sm:text-sm px-3 sm:px-4 whitespace-normal h-auto py-2 leading-tight"
            onClick={onOrderNow}
          >
            ¡PÍDELO HOY Y RECÍBELO EN CASA!
          </Button>
        </div>
      </div>
    </header>
  );
}

'use client';
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onOrderNow: () => void;
}

export default function Header({ onOrderNow }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground">
      <div className="container flex h-auto min-h-[4rem] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3 py-2 sm:h-16 sm:flex-nowrap sm:px-4">
        <div className="flex flex-shrink-0 items-center gap-2">
          <Image
            src="https://i.postimg.cc/zfTmkRBd/Design-sem-nome-20250806-204948-0000.png"
            alt="PosturaBien Logo"
            width={50}
            height={50}
            className="h-12 w-auto sm:h-14"
          />
          <span className="font-bold text-lg text-primary-foreground">PosturaBien</span>
        </div>
        
        <div className="flex-grow sm:flex-grow-0">
          <Button
            style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}
            className={cn(
              "w-full font-bold transition-colors",
              "px-5 py-3 text-sm leading-tight", // Padding and text size
              "hover:bg-[#E6B800]", // Hover state
              "sm:w-auto"
            )}
            onClick={onOrderNow}
          >
            ¡PÍDELO HOY Y RECÍBELO EN CASA!
          </Button>
        </div>
      </div>
    </header>
  );
}

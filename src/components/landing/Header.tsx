'use client';
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onOrderNow: () => void;
  showButton: boolean;
}

export default function Header({ onOrderNow, showButton }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground transition-all duration-300">
      <div className="container flex flex-wrap items-center justify-between gap-y-2 p-2 sm:flex-nowrap sm:px-4 sm:py-2">
        <div className="flex flex-shrink-0 items-center gap-2">
          <Image
            src="https://i.postimg.cc/zfTmkRBd/Design-sem-nome-20250806-204948-0000.png"
            alt="PosturaBien Logo"
            width={40}
            height={40}
            className="h-10 w-auto sm:h-12"
            style={{ maxWidth: '110px' }}
          />
          <span className="font-bold text-lg text-primary-foreground">PosturaBien</span>
        </div>
        
        <div className={cn(
          "flex w-full justify-center transition-all duration-300 sm:w-auto sm:justify-end",
          "basis-full sm:basis-auto",
          showButton ? "opacity-100 max-h-12" : "opacity-0 max-h-0 sm:opacity-100 sm:max-h-12"
        )}>
          <Button
            style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}
            className={cn(
              "w-full max-w-xs font-bold transition-all sm:w-auto",
              "rounded-md text-xs sm:text-sm",
              "px-[14px] py-[6px] text-[13px] leading-tight",
              "hover:bg-[#E6B800]",
              !showButton && "pointer-events-none sm:pointer-events-auto"
            )}
            onClick={onOrderNow}
            tabIndex={showButton ? 0 : -1}
          >
            ¡PÍDELO HOY Y RECÍBELO EN CASA!
          </Button>
        </div>
      </div>
    </header>
  );
}

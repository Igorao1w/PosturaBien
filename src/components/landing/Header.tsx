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
        
        <div className="flex w-full flex-grow-0 basis-full justify-center sm:w-auto sm:basis-auto">
          <Button
            style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}
            className={cn(
              "w-full max-w-xs font-bold transition-colors sm:w-auto", // max-w-xs for very narrow screens
              "rounded-md text-xs sm:text-sm", // Rounded corners, text size
              "px-[14px] py-[6px] text-[13px] leading-tight", // Padding, specific font size
              "hover:bg-[#E6B800]", // Hover state
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

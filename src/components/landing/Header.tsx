import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground">
      <div className="container flex h-14 items-center">
        <div className="mr-2 flex items-center gap-1">
           <Image
            src="https://i.postimg.cc/wTFjhZPt/Design-sem-nome-20250806-204625-0000.png"
            alt="PosturaBien Logo"
            width={50}
            height={50}
            className="h-14 w-auto"
          />
          <span className="font-bold text-lg text-primary-foreground">PosturaBien</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button style={{ backgroundColor: '#FF8800', color: 'black' }} className="font-bold">
            ¡COMPRAR AHORA!
          </Button>
        </div>
      </div>
    </header>
  );
}

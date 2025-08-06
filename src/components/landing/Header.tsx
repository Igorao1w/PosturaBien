import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground">
      <div className="container flex h-20 items-center">
        <div className="mr-4 flex items-center gap-2">
           <Image
            src="https://i.postimg.cc/brCxGSNw/file-00000000dc48622f97dc8d889f0fde30.png"
            alt="PosturaBien Logo"
            width={50}
            height={50}
            className="h-12 w-auto"
          />
          <span className="font-bold text-lg text-primary-foreground">PosturaBien</span>
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

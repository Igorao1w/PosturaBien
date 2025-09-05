'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import OrderForm, { OrderConfirmation } from './OrderForm';
import { Button } from '../ui/button';
import Image from 'next/image';
import { ScrollArea } from '../ui/scroll-area';
import { X } from 'lucide-react';

interface OrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function OrderDialog({ open, onOpenChange }: OrderDialogProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSuccess = () => {
    setIsSubmitted(true);
  };

  const handleClose = (newOpenState: boolean) => {
    onOpenChange(newOpenState);
    if (!newOpenState) {
        setTimeout(() => {
            setIsSubmitted(false);
        }, 300);
    }
  };


  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="p-0 max-w-lg rounded-xl shadow-2xl">
         <DialogHeader className="sr-only">
          <DialogTitle>Formulario de Pedido</DialogTitle>
          <DialogDescription>Complete la información a continuación para realizar su pedido.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[90vh]">
            <div className="p-6 sm:p-8">
                {isSubmitted ? (
                    <div className="py-8">
                        <OrderConfirmation />
                        <Button onClick={() => handleClose(false)} className="w-full mt-6">Cerrar</Button>
                    </div>
                ) : (
                <>
                    <div className="bg-secondary p-4 rounded-xl mb-6">
                    <div className="flex items-center space-x-4">
                        <Image
                        src="https://i.postimg.cc/zfTmkRBd/Design-sem-nome-20250806-204948-0000.png"
                        alt="PosturaBien Logo"
                        width={60}
                        height={60}
                        className="rounded-md"
                        />
                        <div>
                        <h2 className="text-lg font-bold text-primary">Corrector de Postura PosturaBien</h2>
                        <div className="text-lg">
                            <span className="text-red-500 line-through mr-2 decoration-2 text-base">$124.000 COP</span>
                            <span className="text-green-600 font-bold">$79.000 COP</span>
                        </div>
                        </div>
                    </div>
                    <p className="text-sm font-bold text-center mt-3">
                        Entrega gratuita 🚚 + Pago contra entrega 💵 en toda Colombia
                    </p>
                    </div>
                    <div>
                    <h3 className="text-xl font-bold text-center mb-4">🛒 Completa tu pedido</h3>
                    <OrderForm onSuccess={handleSuccess} />
                    </div>
                </>
                )}
            </div>
        </ScrollArea>
        <DialogClose asChild>
            <button className="absolute right-4 top-4 rounded-full p-2 bg-secondary/80 text-primary transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
            </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

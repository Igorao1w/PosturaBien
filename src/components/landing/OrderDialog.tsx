'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import OrderForm, { OrderConfirmation } from './OrderForm';
import { Button } from '../ui/button';
import Image from 'next/image';

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
      <DialogContent className="p-0 max-w-md rounded-xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Formulario de Pedido</DialogTitle>
          <DialogDescription>Complete la información a continuación para realizar su pedido.</DialogDescription>
        </DialogHeader>
        {isSubmitted ? (
            <div className="p-6">
                <OrderConfirmation />
                <Button onClick={() => handleClose(false)} className="w-full mt-6">Cerrar</Button>
            </div>
        ) : (
          <>
            <div className="p-6 bg-secondary rounded-t-xl">
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
            <div className="p-6">
              <h3 className="text-xl font-bold text-center mb-4">🛒 Completa tu pedido</h3>
              <OrderForm onSuccess={handleSuccess} />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

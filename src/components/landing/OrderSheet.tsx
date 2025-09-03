'use client';

import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import OrderForm, { OrderConfirmation } from './OrderForm';
import { Button } from '../ui/button';

interface OrderSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function OrderSheet({ open, onOpenChange }: OrderSheetProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSuccess = () => {
    setIsSubmitted(true);
  };

  const handleClose = (newOpenState: boolean) => {
    onOpenChange(newOpenState);
    // Reset submission state after the sheet closes
    if (!newOpenState) {
        setTimeout(() => {
            setIsSubmitted(false);
        }, 300); // Delay to match sheet closing animation
    }
  };


  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="overflow-y-auto">
        {isSubmitted ? (
            <>
                <SheetHeader>
                    <SheetTitle>¡Pedido Confirmado!</SheetTitle>
                </SheetHeader>
                <OrderConfirmation />
                <Button onClick={() => handleClose(false)} className="w-full mt-6">Cerrar</Button>
            </>
        ) : (
          <>
            <SheetHeader>
              <SheetTitle>Completa tu pedido</SheetTitle>
              <SheetDescription>
                Ingresa tus datos para realizar la compra. ¡Estás a un paso de aliviar tu dolor de espalda!
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <OrderForm onSuccess={handleSuccess} />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

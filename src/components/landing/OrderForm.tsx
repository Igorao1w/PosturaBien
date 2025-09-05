'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { submitOrder } from '@/app/actions';
import { Loader2, CheckCircle, Package, MessageSquare, ShieldCheck, Lock } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const formSchema = z.object({
  fullName: z.string().min(1, 'El nombre completo es obligatorio.').refine(value => value.trim().split(/\s+/).length >= 2, {
    message: 'Por favor, ingresa tu nombre y apellido.',
  }),
  whatsapp: z.string().min(10, 'El número de WhatsApp debe tener 10 dígitos.').max(10, 'El número de WhatsApp debe tener 10 dígitos.').regex(/^3\d{9}$/, 'El número de WhatsApp debe empezar por 3 y tener 10 dígitos.'),
  address: z.string().min(10, 'La dirección debe tener al menos 10 caracteres.'),
  additionalInfo: z.string().optional(),
});

type OrderFormValues = z.infer<typeof formSchema>;

interface OrderFormProps {
  onSuccess: () => void;
}

const InputField = ({ field, placeholder, icon }: { field: any, placeholder: string, icon: string }) => (
    <div className="relative flex items-center">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">{icon}</span>
        <Input placeholder={placeholder} {...field} className="pl-10" />
    </div>
);

export default function OrderForm({ onSuccess }: OrderFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      whatsapp: '',
      address: '',
      additionalInfo: '',
    },
  });

  const onSubmit = (values: OrderFormValues) => {
    startTransition(async () => {
      const result = await submitOrder(values);
      if (result.success) {
        onSuccess();
        form.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error en el formulario',
          description: result.error || 'Ocurrió un error inesperado.',
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputField field={field} placeholder="👤 Nombre completo" icon="👤" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="whatsapp"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputField field={field} placeholder="📱 3XX XXX XXXX" icon="📱" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputField field={field} placeholder="📍 Dirección completa" icon="📍" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="additionalInfo"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative flex items-center">
                    <span className="absolute left-3 top-3 text-lg">🏠</span>
                    <Textarea placeholder="🏠 Referencia adicional (opcional)" {...field} className="pl-10" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          disabled={isPending} 
          className="w-full font-bold text-lg h-12"
          style={{ backgroundColor: '#FFD447', color: 'black' }}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Procesando...
            </>
          ) : (
            '✅ CONFIRMAR PEDIDO'
          )}
        </Button>
      </form>
      <div className="mt-4 text-center text-xs text-muted-foreground space-y-1">
        <p className="flex items-center justify-center gap-1.5"><Lock className="w-3 h-3"/> Compra 100% segura. Tus datos están protegidos.</p>
        <p className="flex items-center justify-center gap-1.5"><MessageSquare className="w-3 h-3"/> Nuestro equipo se pondrá en contacto por WhatsApp para confirmar tu pedido.</p>
      </div>
    </Form>
  );
}

export function OrderConfirmation() {
    return (
        <div className="flex flex-col items-center justify-center text-center p-4">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-primary mb-2">¡Gracias por tu pedido!</h2>
            <p className="text-foreground mb-6">Tu solicitud fue registrada con éxito.</p>
            <Card className="w-full text-left bg-secondary border-primary/20">
                <CardContent className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                        <Package className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                        <p className="text-sm text-foreground">
                            <strong>Tu pedido será enviado a tu dirección en los próximos días.</strong>
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <MessageSquare className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                        <p className="text-sm text-foreground">
                           <strong>Mantente atento a tu WhatsApp:</strong> nuestro equipo te contactará para confirmar la entrega.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

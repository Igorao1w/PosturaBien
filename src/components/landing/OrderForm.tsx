'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { submitOrder } from '@/app/actions';
import { Loader2, CheckCircle, Package, MessageSquare, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Checkbox } from '../ui/checkbox';

const formSchema = z.object({
  fullName: z.string().min(1, 'El nombre completo es obligatorio.').refine(value => value.trim().split(/\s+/).length >= 2, {
    message: 'Por favor, ingresa tu nombre y apellido.',
  }),
  whatsapp: z.string().min(10, 'El número de WhatsApp debe tener 10 dígitos.').max(10, 'El número de WhatsApp debe tener 10 dígitos.').regex(/^3\d{9}$/, 'El número de WhatsApp debe empezar por 3 y tener 10 dígitos.'),
  address: z.string().min(10, 'La dirección debe tener al menos 10 caracteres.'),
  additionalInfo: z.string().optional(),
  orderBump: z.boolean().default(false),
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
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      whatsapp: '',
      address: '',
      additionalInfo: '',
      orderBump: false,
    },
  });

  const onSubmit = (values: OrderFormValues) => {
    try {
        const audio = document.getElementById("confirmSound") as HTMLAudioElement;
        if (audio) {
          audio.volume = 0.6;
          audio.pause();
          audio.currentTime = 0;
          setTimeout(() => {
            audio.play().catch(function(error) {
              console.error("Error al reproducir audio:", error);
            });
          }, 50);
        }
    } catch (error) {
        console.error("Failed to play confirmation sound:", error);
    }
    
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
      <audio id="confirmSound" preload="auto" src="https://www.dropbox.com/scl/fi/9nfxjuon0dfl9llq4a1qn/VID_20250905_210318.mp3?rlkey=ux95q7ahq1q4k46trudr3fsjy&st=gvurusmf&raw=1"></audio>
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
          className="w-full font-bold text-lg h-12 bg-[#FFD447] text-black hover:bg-[#E6B800]"
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
      <div className="mt-6 space-y-6">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          <p>
            <strong>Compra 100% segura.</strong> Garantía de satisfacción.
          </p>
        </div>
        
        <div className="relative mx-auto w-32 h-32">
          <Image
            src="https://i.postimg.cc/zfTmkRBd/Design-sem-nome-20250806-204948-0000.png"
            alt="Producto PosturaBien"
            width={128}
            height={128}
            className="rounded-md"
          />
          <div className="absolute -bottom-2 -right-8 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md transform -rotate-12">
            Más vendido en Colombia
          </div>
        </div>

        <FormField
          control={form.control}
          name="orderBump"
          render={({ field }) => (
            <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-secondary">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="font-bold text-base cursor-pointer">
                  ¡Sí! Quiero agregar un corrector adicional por solo $59.000 COP
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                    Aprovecha esta oferta exclusiva y llévate el segundo con un gran descuento. ¡Ideal para regalar o tener uno de repuesto!
                </p>
              </div>
            </FormItem>
          )}
        />

        <div className="mt-4 text-center text-xs text-muted-foreground">
            <p className="flex items-center justify-center gap-1.5"><MessageSquare className="w-3 h-3"/> Nuestro equipo se pondrá en contacto por WhatsApp para confirmar tu pedido.</p>
        </div>
      </div>
    </Form>
  );
}

export function OrderConfirmation() {
    return (
        <div className="flex flex-col items-center justify-center text-center p-4 animate-in fade-in-0 duration-1000">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-confirm-icon" />
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

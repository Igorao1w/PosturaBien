
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { submitOrder } from '@/app/actions';
import { Loader2, CheckCircle, Package, MessageSquare, ShieldCheck, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { cn } from '@/lib/utils';
import { Checkbox } from '../ui/checkbox';
import Image from 'next/image';

const formSchema = z.object({
  fullName: z.string().min(1, 'El nombre completo es obligatorio.').refine(value => value.trim().split(/\s+/).length >= 2, {
    message: 'Por favor, ingresa tu nombre y apellido.',
  }),
  whatsapp: z.string().min(10, 'El número de WhatsApp debe tener 10 dígitos.').max(10, 'El número de WhatsApp debe tener 10 dígitos.').regex(/^3\d{9}$/, 'El número de WhatsApp debe empezar por 3 y tener 10 dígitos.'),
  address: z.string().min(10, 'La dirección debe tener al menos 10 caracteres.'),
  size: z.string({ required_error: "Por favor, selecciona una talla." }).min(1, "Por favor, selecciona una talla."),
  additionalInfo: z.string().optional(),
  addBump: z.boolean().default(false).optional(),
  bumpSize: z.string().optional(),
}).refine(data => {
    if (data.addBump && !data.bumpSize) {
        return false;
    }
    return true;
}, {
    message: "Por favor, selecciona una talla para el segundo corrector.",
    path: ["bumpSize"],
});


type OrderFormValues = z.infer<typeof formSchema>;

interface OrderFormProps {
  onSuccess: () => void;
}

const sizeOptions = [
  { value: 'S', label: 'S – Altura 130–160cm | Cintura 62–74cm | Peso 27–47kg' },
  { value: 'M', label: 'M – Altura 150–170cm | Cintura 72–84cm | Peso 45–67kg' },
  { value: 'L', label: 'L – Altura 165–175cm | Cintura 82–94cm | Peso 52–77kg' },
  { value: 'XL', label: 'XL – Altura 170–185cm | Cintura 90–105cm | Peso 67–87kg' },
  { value: 'XXL', label: 'XXL – Altura 180–195cm | Cintura 95–118cm | Peso 87–97kg' },
];

const InputField = ({ field, placeholder, icon }: { field: any, placeholder: string, icon: string }) => (
    <div className="relative flex items-center">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">{icon}</span>
        <Input placeholder={placeholder} {...field} className="pl-10" />
    </div>
);

const MAIN_PRODUCT_PRICE = 119900;
const BUMP_PRICE = 69900;

async function sendUtmifyConversion(values: OrderFormValues) {
  const payload = {
    orderId: "FORM-" + Date.now(),
    platform: "firebase_form",
    paymentMethod: "cash_on_delivery",
    status: "paid",
    createdAt: new Date().toISOString(),
    approvedDate: new Date().toISOString(),
    customer: {
      name: values.fullName,
      email: `${values.whatsapp}@email.com`, // Using whatsapp as placeholder for email
    },
    products: [{
      id: "P001",
      name: "Corrector de Postura",
      quantity: 1,
      priceInCents: 0
    }],
    isTest: false
  };

  try {
    const response = await fetch("https://api.utmify.com.br/v1/conversions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-token": "OKO1TOpLyGjmWOScW0M9m8z0mL8xtORqD3ai"
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert("Venda registrada na UTMfy 🚀");
    } else {
      console.error("UTMify API Error:", await response.json());
      alert("Erro ao enviar venda ❌");
    }
  } catch (error) {
    console.error("Network error sending to UTMify:", error);
    alert("Erro ao enviar venda ❌");
  }
}

export default function OrderForm({ onSuccess }: OrderFormProps) {
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    const audio = new Audio("https://www.dropbox.com/scl/fi/9nfxjuon0dfl9llq4a1qn/VID_20250905_210318.mp3?rlkey=ux95q7ahq1q4k46trudr3fsjy&st=gvurusmf&raw=1");
    audio.preload = "auto";
    audio.volume = 0.6;
    audioRef.current = audio;
  }, []);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      whatsapp: '',
      address: '',
      size: undefined,
      additionalInfo: '',
      addBump: false,
      bumpSize: undefined,
    },
  });

  const isBumpChecked = form.watch('addBump');

  const totalPrice = isBumpChecked
    ? MAIN_PRODUCT_PRICE + BUMP_PRICE
    : MAIN_PRODUCT_PRICE;


  const onSubmit = (values: OrderFormValues) => {
    startTransition(async () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setTimeout(() => {
            audioRef.current?.play().catch(e => console.warn('Error playing audio:', e));
        }, 50);
      }
      const result = await submitOrder(values);
      if (result.success) {
        await sendUtmifyConversion(values); // Call UTMify conversion
        if (typeof window.utmify === 'function') {
            const purchaseValue = isBumpChecked ? MAIN_PRODUCT_PRICE + BUMP_PRICE : MAIN_PRODUCT_PRICE;
            window.utmify('track', 'Purchase', { currency: 'COP', value: purchaseValue });
        }
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
          name="size"
          render={({ field }) => (
            <FormItem>
              <div className="relative flex items-center">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg z-10">📏</span>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={cn(
                      "pl-10 text-base md:text-sm",
                      !field.value && "text-muted-foreground"
                    )}>
                      <SelectValue placeholder="Selecciona tu talla" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sizeOptions.map((option) => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value}
                        className="whitespace-normal text-xs sm:text-sm p-2"
                      >
                        <div className="w-full break-words">{option.label}</div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
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
        
        {/* Order Bump Section */}
        <div className="mt-6 p-4 border-2 border-dashed border-yellow-500 bg-yellow-50 rounded-lg">
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <Image 
                    src="https://i.postimg.cc/Vk8RKmDV/foto.jpg"
                    alt="Oferta especial de 2 correctores posturales"
                    width={100}
                    height={100}
                    className="rounded-md object-cover w-24 h-24 sm:w-28 sm:h-28"
                />
                <div className="flex-1 text-center sm:text-left">
                    <h4 className="text-lg font-bold text-gray-800">🔥 ¡Lleva más 1 Corretor Postural con DESCUENTO exclusivo!</h4>
                    <p className="text-sm text-gray-600 mt-1">
                        Garanta um segundo corretor por apenas <strong>${new Intl.NumberFormat('es-CO').format(BUMP_PRICE)} COP</strong> e economize ainda mais.
                    </p>
                </div>
            </div>
            
            <FormField
                control={form.control}
                name="addBump"
                render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 mt-4 bg-white p-3 rounded-md border">
                        <FormControl>
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="addBump"
                                className="h-5 w-5"
                            />
                        </FormControl>
                        <FormLabel htmlFor="addBump" className="font-bold text-base text-gray-700 cursor-pointer">
                            ¡SÍ! Quiero adicionar más 1 Corretor Postural.
                        </FormLabel>
                    </FormItem>
                )}
            />

            {isBumpChecked && (
                <div className="mt-4 animate-in fade-in-50 duration-500">
                    <FormField
                        control={form.control}
                        name="bumpSize"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold">Talla para el segundo corrector:</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona la talla" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {sizeOptions.map((option) => (
                                        <SelectItem 
                                            key={option.value} 
                                            value={option.value}
                                            className="whitespace-normal text-xs sm:text-sm p-2"
                                        >
                                            {option.label}
                                        </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            )}
        </div>

        <Button 
          type="submit" 
          disabled={isPending} 
          className="w-full font-bold text-lg h-12 bg-[#FFD447] text-black hover:bg-[#E6B800] mt-6"
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
      <div className="mt-6 space-y-4">
        
        <div className="text-center font-bold text-xl text-green-600 bg-green-50 p-3 rounded-md">
            Total Actualizado: ${new Intl.NumberFormat('es-CO').format(totalPrice)} COP
        </div>

        {isBumpChecked && (
             <p className="text-center text-sm text-gray-600 italic mt-2">
                ✅ ¡Oferta exclusiva válida solamente ahora. Aproveite e tenha um corretor extra para você ou para presentear!
            </p>
        )}

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          <p>
            <strong>Compra 100% segura.</strong> Garantía de satisfacción.
          </p>
        </div>
        
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

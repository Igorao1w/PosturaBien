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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  fullName: z.string().min(1, 'El nombre completo es obligatorio.').refine(value => value.trim().split(/\s+/).length >= 2, {
    message: 'Por favor, ingresa tu nombre y apellido.',
  }),
  whatsapp: z.string().min(10, 'El número de WhatsApp debe tener 10 dígitos.').max(10, 'El número de WhatsApp debe tener 10 dígitos.').regex(/^3\d{9}$/, 'El número de WhatsApp debe empezar por 3 y tener 10 dígitos.'),
  address: z.string().min(10, 'La dirección debe tener al menos 10 caracteres.'),
  size: z.string({ required_error: "⚠️ Por favor, selecciona tu talla antes de continuar." }),
  additionalInfo: z.string().optional(),
  orderBump: z.boolean().default(false),
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
      orderBump: false,
    },
  });

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
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className={cn(
                      "pl-10 text-base md:text-sm",
                      !field.value && "text-muted-foreground"
                    )}>
                      <SelectValue placeholder="Selecciona tu talla" />
                    </SelectTrigger>
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
                </FormControl>
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

        <div className="mt-6 space-y-6">
          <FormField
            control={form.control}
            name="orderBump"
            render={({ field }) => (
              <FormItem 
                className={cn(
                  "rounded-lg border-2 p-4 shadow-sm transition-all duration-300 cursor-pointer",
                  field.value ? "border-yellow-500 bg-yellow-500/10" : "border-dashed border-gray-400 bg-secondary hover:border-yellow-500"
                )}
                onClick={() => field.onChange(!field.value)}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src="https://i.postimg.cc/k47jC2S2/2-unidades.png"
                      alt="Oferta especial: 2 correctores de postura"
                      width={96}
                      height={96}
                      className="rounded-md object-contain"
                    />
                     <div className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full transform rotate-12 shadow-lg">
                      OFERTA
                    </div>
                  </div>
                  <div className="space-y-1 leading-none flex-grow">
                    <div className="flex items-start space-x-3">
                      <FormControl className="mt-1">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="h-5 w-5 border-2"
                        />
                      </FormControl>
                      <div>
                        <FormLabel className="font-bold text-base cursor-pointer">
                          ¡OFERTA ESPECIAL! Quiero agregar un corrector adicional por solo $59.000 COP
                        </FormLabel>
                        <p className="text-sm text-muted-foreground mt-1">
                          ¡Aprovecha y llévate el segundo con un gran descuento! Perfecto para regalar o tener un repuesto siempre listo.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </FormItem>
            )}
          />
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

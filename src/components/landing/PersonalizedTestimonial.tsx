'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { getPersonalizedTestimonial } from '@/app/actions';
import { Loader2, Sparkles } from 'lucide-react';
import type { PersonalizeTestimonialOutput } from '@/ai/flows/personalize-testimonial';

const formSchema = z.object({
  age: z.coerce.number().min(18, { message: 'Debes tener al menos 18 años.' }).max(100, { message: 'La edad no puede ser mayor a 100.' }),
  gender: z.enum(['male', 'female'], { required_error: 'Por favor, selecciona tu género.' }),
  painLocation: z.string().min(3, { message: 'Describe dónde sientes más dolor (ej. espalda baja, cuello).' }),
  painLevel: z.coerce.number().min(1).max(10),
  activityLevel: z.string().min(3, { message: 'Describe tu actividad diaria (ej. sedentario, activo).' }),
});

export default function PersonalizedTestimonial() {
  const [isPending, startTransition] = useTransition();
  const [aiResponse, setAiResponse] = useState<PersonalizeTestimonialOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 30,
      painLocation: 'espalda baja',
      painLevel: 7,
      activityLevel: 'trabajo de oficina',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setAiResponse(null);
    startTransition(async () => {
        const result = await getPersonalizedTestimonial(values);
        if (result.success && result.data) {
            setAiResponse(result.data);
        } else {
            toast({
                variant: "destructive",
                title: "Error al generar testimonio",
                description: result.error || "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.",
            });
        }
    });
  }

  return (
    <section id="ai-testimonial" className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <Sparkles className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="text-3xl md:text-4xl font-bold text-primary mt-4">¿Funcionará para ti?</CardTitle>
            <CardDescription className="text-lg mt-2">
              Completa tus datos y nuestra IA creará un testimonio de alguien como tú para que veas cómo PosturaBien puede ayudarte.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tu Edad</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Ej: 35" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Género</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tu género" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Masculino</SelectItem>
                            <SelectItem value="female">Femenino</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="painLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>¿Dónde sientes más dolor?</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Espalda alta, cuello, hombros" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="activityLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nivel de Actividad Diario</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Sedentario, activo, levanto peso" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={form.control}
                    name="painLevel"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nivel de Dolor (1 = Leve, 10 = Insoportable)</FormLabel>
                        <FormControl>
                            <div className="flex items-center gap-4">
                            <Slider
                                min={1}
                                max={10}
                                step={1}
                                defaultValue={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                            />
                            <span className="font-bold text-primary text-lg w-12 text-center">{field.value}</span>
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPending} className="w-full font-bold" size="lg">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    'Crear mi Testimonio Personalizado'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          {aiResponse && (
            <CardFooter>
              <Card className="w-full bg-secondary border-primary/20">
                <CardHeader>
                    <CardTitle className="text-primary flex items-center gap-2">
                        <Sparkles className="h-5 w-5"/>
                        Un testimonio para alguien como tú:
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg italic text-foreground">"{aiResponse.testimonial}"</p>
                </CardContent>
              </Card>
            </CardFooter>
          )}
        </Card>
      </div>
    </section>
  );
}

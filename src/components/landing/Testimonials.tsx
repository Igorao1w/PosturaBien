import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    name: 'Juan P.',
    age: 35,
    location: 'Bogotá D.C.',
    quote: 'Pasaba horas en la oficina y mi espalda me mataba. Con PosturaBien, he sentido un alivio increíble en mi zona lumbar. ¡Totalmente recomendado!',
    avatar: 'https://i.postimg.cc/3NTY5bh2/20250808-203223-0000.png',
    aiHint: 'man smiling'
  },
  {
    name: 'Mariana G.',
    age: 29,
    location: 'Medellín',
    quote: 'Soy diseñadora y mi mala postura era un problema. Desde que uso el corrector, me siento más erguida y con más energía. ¡Y es súper discreto debajo de la ropa!',
    avatar: 'https://i.postimg.cc/8cmD1Bk9/20250808-203313-0000.png',
    aiHint: 'woman smiling'
  },
  {
    name: 'Carlos V.',
    age: 42,
    location: 'Cali',
    quote: 'Pensé que el dolor de espalda alta era algo con lo que tenía que vivir. Este corrector me demostró lo contrario. Es simple, cómodo y muy efectivo.',
    avatar: 'https://placehold.co/100x100.png',
    aiHint: 'man portrait'
  },
  {
    name: 'Sofía L.',
    age: 27,
    location: 'Barranquilla',
    quote: 'Lo compré por recomendación y ha sido la mejor inversión. Lo uso mientras trabajo desde casa y la diferencia en mi postura y dolor es del cielo a la tierra.',
    avatar: 'https://placehold.co/100x100.png',
    aiHint: 'woman portrait'
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-secondary py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Lo que dicen nuestros clientes satisfechos</h2>
          <p className="mt-4 text-lg text-foreground max-w-2xl mx-auto">
            Historias reales de personas que, como tú, decidieron ponerle fin al dolor de espalda.
          </p>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="sm:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="h-full flex flex-col">
                    <CardContent className="flex flex-col text-center p-6 flex-grow">
                      <div className="flex text-yellow-500 mb-4 mx-auto">
                        {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" className="w-5 h-5"/>)}
                      </div>
                      <p className="text-foreground mb-4 flex-grow text-left">"{testimonial.quote}"</p>
                      <div className="flex items-center gap-4 mt-auto">
                          <Avatar>
                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.aiHint} />
                            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className='text-left'>
                            <div className="font-bold text-primary">{testimonial.name}</div>
                            <div className="text-sm text-muted-foreground">{testimonial.age} años, {testimonial.location}</div>
                          </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-2 sm:left-[-3.5rem]" />
          <CarouselNext className="-right-2 sm:right-[-3.5rem]" />
        </Carousel>
      </div>
    </section>
  );
}

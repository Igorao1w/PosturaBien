'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

const carouselImages = [
    { src: "https://i.postimg.cc/VNNcFhj6/corretor-11.jpg", alt: "Woman wearing posture corrector" },
    { src: "https://i.postimg.cc/MZBJtVjy/corretor-03.gif", alt: "Animation showing posture correction" },
    { src: "https://i.postimg.cc/9XZsy2vb/imagen-2025-07-22-194214896-1.jpg", alt: "Man wearing posture corrector at desk" },
    { src: "https://i.postimg.cc/ZR3sPPDn/imagen-2025-07-21-232048329.jpg", alt: "Close up of posture corrector" },
];

export default function Hero() {
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true, playOnInit: true, stopOnLastSnap: false })
  )

  return (
    <section id="hero" className="container mx-auto px-4 py-16 sm:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
            ¡Dile Adiós al Dolor de Espalda y Redescubre tu Bienestar!
          </h1>
          <p className="mt-4 text-lg text-foreground">
            Nuestro corrector de postura ortopédico está diseñado para aliviar el dolor, mejorar tu alineación y devolverte la confianza. Vive cada día al máximo, sin molestias.
          </p>
          <div className="mt-8">
            <Button size="lg" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} className="font-bold text-lg shadow-lg hover:shadow-xl transition-shadow">
              ¡PÍDELO AHORA Y PAGA EN CASA!
            </Button>
            <div className="mt-2 text-md">
                <span className="text-red-500 line-through mr-2 decoration-2">$124.000 COP</span>
                <span className="text-green-600 font-bold">$79.000 COP</span>
                <p className="text-sm text-muted-foreground">Envío Gratis a toda Colombia</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <Carousel
            plugins={[plugin.current]}
            className="w-full max-w-lg"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {carouselImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={500}
                      height={500}
                      className="rounded-lg shadow-2xl w-full h-auto object-cover aspect-square"
                      data-ai-hint="posture corrector"
                      priority={index === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}

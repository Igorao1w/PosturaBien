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

interface HeroProps {
  onOrderNow: () => void;
}

export default function Hero({ onOrderNow }: HeroProps) {
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <section id="hero" className="container mx-auto px-4 pt-4 pb-12 sm:pt-6 sm:pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
            ¿Tu espalda duele tanto que ya lo aceptaste como normal?
          </h1>
          <p className="mt-4 text-md text-foreground/80">
            Cada día que lo ignoras, tu postura empeora.
          </p>
          <p className="mt-2 text-lg font-bold text-foreground">
            Entrega gratuita + Pago contra entrega en toda Colombia
          </p>
          <div className="mt-8">
            <Button 
              size="lg" 
              style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} 
              className="font-bold text-lg shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto px-6 py-3 hover:bg-[#E6B800]"
              onClick={onOrderNow}
            >
              ¡PÍDELO AHORA Y PAGA EN CASA!
            </Button>
            <div className="mt-2 text-md">
                <span className="text-red-500 line-through mr-2 decoration-2">$124.000 COP</span>
                <span className="text-green-600 font-bold">$79.000 COP</span>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <Carousel
            plugins={[plugin.current]}
            className="w-full max-w-md"
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
                      className="rounded-lg shadow-2xl w-full h-full object-contain aspect-square"
                      data-ai-hint="posture corrector"
                      priority={index === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 sm:left-4" />
            <CarouselNext className="right-2 sm:right-4" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}

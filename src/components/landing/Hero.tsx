import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function Hero() {
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
            <p className="mt-2 text-sm text-muted-foreground">
              $79.000 COP - Envío Gratis a toda Colombia
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <Image
            src="https://i.postimg.cc/NMxVzDbC/20250806-191750-0000.png"
            alt="Corrector de postura ortopédico PosturaBien"
            width={500}
            height={500}
            className="rounded-lg shadow-2xl"
            data-ai-hint="posture corrector"
          />
        </div>
      </div>
    </section>
  );
}

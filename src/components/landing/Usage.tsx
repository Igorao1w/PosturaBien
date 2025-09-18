
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const usageSteps = [
  {
    step: 1,
    title: 'Póntelo Fácilmente',
    description: 'Desliza el corrector sobre tus hombros como si fuera una mochila y abróchate el cinturón.',
    image: 'https://i.postimg.cc/dQgRqqt9/Captura-de-tela-2025-09-18-123628.jpg',
    aiHint: 'person putting on brace',
    isGif: false,
  },
  {
    step: 2,
    title: 'Ajusta las Correas',
    description: 'Tira de las correas para ajustar el nivel de tensión hasta que sientas tus hombros suavemente hacia atrás.',
    image: 'https://i.postimg.cc/fRC00ZZp/Captura-de-tela-2025-09-18-123612.jpg',
    aiHint: 'adjusting straps posture corrector',
    isGif: false,
  },
  {
    step: 3,
    title: 'Siente la Diferencia',
    description: 'Disfruta de una postura correcta y sin dolor. Úsalo de 1 a 2 horas diarias para obtener mejores resultados.',
    image: 'https://i.postimg.cc/6QX5rKcN/20250806-221934-0003.gif',
    aiHint: 'person standing straight',
    isGif: true,
  },
];

export default function Usage() {
  const [activeStep, setActiveStep] = useState(1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleStepClick = (step: number) => {
    setActiveStep(step);
  };

  return (
    <section id="usage" className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Tan Fácil Como Contar Hasta 3</h2>
          <p className="mt-4 text-lg text-foreground max-w-2xl mx-auto">
            Usar tu corrector PosturaBien es simple e intuitivo. Sigue estos pasos y empieza a sentir el cambio.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {usageSteps.map((item) => {
            const isActive = activeStep === item.step;
            // Re-trigger GIF animation only if it's the active step, it's a GIF, and client has mounted
            const imageSrc = isActive && item.isGif && isClient
              ? `${item.image}?t=${Date.now()}`
              : item.image;
            
            return (
              <Card 
                key={item.step} 
                className={cn(
                  "overflow-hidden shadow-lg transition-all duration-300 cursor-pointer",
                  isActive ? "scale-105 shadow-2xl ring-2 ring-primary" : "scale-100 opacity-80"
                )}
                onClick={() => handleStepClick(item.step)}
              >
                <CardContent className="p-0 text-center">
                  <Image
                    src={imageSrc}
                    alt={item.title}
                    width={400}
                    height={400}
                    className="w-full h-auto"
                    data-ai-hint={item.aiHint}
                    unoptimized={item.isGif}
                  />
                  <div className="p-6">
                    <p className="text-primary font-bold text-lg mb-2">Paso {item.step}</p>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  );
}

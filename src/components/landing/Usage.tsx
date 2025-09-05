'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const usageSteps = [
  {
    step: 1,
    title: 'Póntelo Fácilmente',
    description: 'Desliza el corrector sobre tus hombros como si fuera una mochila y abróchate el cinturón.',
    image: 'https://i.postimg.cc/8cHhSwC7/20250806-220301-0001.gif',
    aiHint: 'person putting on brace',
    duration: 3000,
  },
  {
    step: 2,
    title: 'Ajusta las Correas',
    description: 'Tira de las correas para ajustar el nivel de tensión hasta que sientas tus hombros suavemente hacia atrás.',
    image: 'https://i.postimg.cc/g26nyNP3/20250806-221402-0002.gif',
    aiHint: 'adjusting straps posture corrector',
    duration: 3000,
  },
  {
    step: 3,
    title: 'Siente la Diferencia',
    description: 'Disfruta de una postura correcta y sin dolor. Úsalo de 1 a 2 horas diarias para obtener mejores resultados.',
    image: 'https://i.postimg.cc/6QX5rKcN/20250806-221934-0003.gif',
    aiHint: 'person standing straight',
    duration: 3000,
  },
];

export default function Usage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(1);
  const [isInView, setIsInView] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.5, // Trigger when 50% of the section is visible
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isInView && isClient) {
      const currentStepDuration = usageSteps.find(s => s.step === activeStep)?.duration || 3000;
      timer = setTimeout(() => {
        setActiveStep((prevStep) => (prevStep % usageSteps.length) + 1);
      }, currentStepDuration);
    } else {
        // When not in view, reset to the first step to be ready
        setActiveStep(1);
    }
    return () => clearTimeout(timer);
  }, [activeStep, isInView, isClient]);
  

  return (
    <section id="usage" className="py-16 sm:py-24" ref={sectionRef}>
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
            const imageSrc = isActive && isClient
              ? `${item.image}?t=${Date.now()}` // Use Date.now() for unique key
              : item.image;
            
            return (
              <Card 
                key={item.step} 
                className={cn(
                  "overflow-hidden shadow-lg transition-all duration-500",
                  isActive ? "scale-105 shadow-2xl ring-2 ring-primary" : "scale-100 opacity-80"
                )}
              >
                <CardContent className="p-0 text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc}
                    alt={item.title}
                    className="w-full h-auto"
                    data-ai-hint={item.aiHint}
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

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

const usageSteps = [
  {
    step: 1,
    title: 'Póntelo Fácilmente',
    description: 'Desliza el corrector sobre tus hombros como si fuera una mochila y abróchate el cinturón.',
    image: 'https://i.postimg.cc/8cHhSwC7/20250806-220301-0001.gif',
    aiHint: 'person putting on brace',
  },
  {
    step: 2,
    title: 'Ajusta las Correas',
    description: 'Tira de las correas para ajustar el nivel de tensión hasta que sientas tus hombros suavemente hacia atrás.',
    image: 'https://placehold.co/400x400.png',
    aiHint: 'adjusting straps posture corrector',
  },
  {
    step: 3,
    title: 'Siente la Diferencia',
    description: 'Disfruta de una postura correcta y sin dolor. Úsalo de 1 a 2 horas diarias para obtener mejores resultados.',
    image: 'https://placehold.co/400x400.png',
    aiHint: 'person standing straight',
  },
];

export default function Usage() {
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
          {usageSteps.map((item) => (
            <Card key={item.step} className="overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
              <CardContent className="p-0 text-center">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={400}
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
          ))}
        </div>
      </div>
    </section>
  );
}

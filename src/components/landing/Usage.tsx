'use client';

import React, { useRef, useEffect, useState } from 'react';
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
    image: 'https://i.postimg.cc/g26nyNP3/20250806-221402-0002.gif',
    aiHint: 'adjusting straps posture corrector',
  },
  {
    step: 3,
    title: 'Siente la Diferencia',
    description: 'Disfruta de una postura correcta y sin dolor. Úsalo de 1 a 2 horas diarias para obtener mejores resultados.',
    image: 'https://i.postimg.cc/6QX5rKcN/20250806-221934-0003.gif',
    aiHint: 'person standing straight',
  },
];

interface GifPlayerProps {
  src: string;
  alt: string;
  aiHint: string;
}

const GifPlayer: React.FC<GifPlayerProps> = ({ src, alt, aiHint }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isPlaying) {
          setIsPlaying(true);
          if (imgRef.current) {
            // By setting the src, we force the GIF to reload and play from the start.
            imgRef.current.src = src;
          }
          observer.disconnect(); // Play only once on first viewport entry
        }
      },
      {
        threshold: 0.5, // Trigger when 50% of the element is visible
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]); // We only want this effect to run based on src, not isPlaying

  const handleClick = () => {
    if (imgRef.current) {
      // Re-assigning the src is a common trick to restart a GIF
      const currentSrc = imgRef.current.src;
      imgRef.current.src = '';
      imgRef.current.src = currentSrc;
      setIsPlaying(true);
    }
  };
  
  // Use a unique query param to prevent browser caching issues
  const uniqueSrc = `${src}?t=${new Date().getTime()}`;

  return (
    <img
      ref={imgRef}
      // Set initial src to a non-animated version if possible, or just the gif itself
      src={isPlaying ? uniqueSrc : src}
      alt={alt}
      onClick={handleClick}
      className="w-full h-auto cursor-pointer"
      data-ai-hint={aiHint}
    />
  );
};

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
                <GifPlayer
                  src={item.image}
                  alt={item.title}
                  aiHint={item.aiHint}
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

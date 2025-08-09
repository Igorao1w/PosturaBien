import React from 'react';
import { AlertTriangle } from 'lucide-react';

const warnings = [
  {
    icon: <AlertTriangle className="w-8 h-8 text-destructive" />,
    text: 'Tu espalda sigue encorvándose',
  },
  {
    icon: <AlertTriangle className="w-8 h-8 text-destructive" />,
    text: 'Tu energía sigue cayendo',
  },
  {
    icon: <AlertTriangle className="w-8 h-8 text-destructive" />,
    text: 'Terminas medicado a los 40',
  },
];

export default function Warning() {
  return (
    <section id="warning" className="bg-background py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">¿Qué pasa si no haces nada?</h2>
          <div className="mt-8 space-y-6">
            {warnings.map((warning, index) => (
              <div key={index} className="flex items-center justify-center gap-4 p-4 border-l-4 border-destructive bg-destructive/10 rounded-r-lg text-left">
                {warning.icon}
                <p className="text-lg sm:text-xl font-medium text-foreground">{warning.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <p className="inline-block bg-card text-red-600 text-xl sm:text-2xl font-bold p-4 rounded-lg shadow-md">
              Corregir tu postura no es estética. Es supervivencia.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

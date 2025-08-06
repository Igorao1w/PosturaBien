import React from 'react';
import { Button } from '@/components/ui/button';
import { Truck, Wallet } from 'lucide-react';

export default function CTA() {
  return (
    <section id="cta" className="bg-primary text-primary-foreground py-16 sm:py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">¡No Esperes Más para Vivir Sin Dolor!</h2>
        <p className="mt-4 text-lg max-w-2xl mx-auto text-primary-foreground/90">
          Únete a los miles que ya han transformado su vida con PosturaBien. Tu espalda te lo agradecerá.
        </p>
        <div className="mt-8">
          <Button size="lg" variant="secondary" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} className="font-bold text-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
            ¡SÍ, LO QUIERO AHORA!
          </Button>
          <p className="mt-4 text-2xl font-bold text-accent">
            OFERTA: $79.000 COP
          </p>
          <div className="mt-4 flex justify-center items-center gap-6 text-primary-foreground/90">
              <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5"/>
                  <span>Envío Gratis</span>
              </div>
              <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5"/>
                  <span>Pago Contra Entrega</span>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { ShieldCheck, UserCheck, Shirt, Users, Rocket, Award } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const benefits = [
  {
    icon: <ShieldCheck className="w-10 h-10 text-primary" fill="hsl(var(--accent))" />,
    title: 'Alivio Inmediato del Dolor',
    description: 'Siente cómo la tensión en tu espalda disminuye desde el primer uso, aliviando dolores crónicos y agudos.',
  },
  {
    icon: <UserCheck className="w-10 h-10 text-primary" fill="hsl(var(--accent))" />,
    title: 'Corrige tu Postura',
    description: 'Re-entrena tus músculos y columna para mantener una alineación natural y saludable durante todo el día.',
  },
  {
    icon: <Rocket className="w-10 h-10 text-primary" fill="hsl(var(--accent))" />,
    title: 'Aumenta tu Confianza',
    description: 'Una postura erguida no solo te hace ver más alto y seguro, sino que también mejora tu estado de ánimo.',
  },
  {
    icon: <Shirt className="w-10 h-10 text-primary" fill="hsl(var(--accent))" />,
    title: 'Cómodo y Discreto',
    description: 'Diseñado con materiales transpirables para que puedas usarlo debajo de tu ropa sin que nadie lo note.',
  },
  {
    icon: <Users className="w-10 h-10 text-primary" fill="hsl(var(--accent))" />,
    title: 'Unisex y Totalmente Ajustable',
    description: 'Se adapta perfectamente a hombres y mujeres de todas las tallas gracias a sus correas elásticas y ajustables.',
  },
  {
    icon: <Award className="w-10 h-10 text-primary" fill="hsl(var(--accent))" />,
    title: 'Materiales de Alta Calidad',
    description: 'Construido para durar y ofrecerte el soporte que necesitas día tras día, con materiales resistentes y suaves.',
  },
];

export default function Benefits() {
  return (
    <section id="benefits" className="bg-secondary py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Beneficios de Usar PosturaBien</h2>
          <p className="mt-4 text-lg text-foreground max-w-2xl mx-auto">
            Descubre por qué miles de colombianos han elegido PosturaBien para mejorar su calidad de vida.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto bg-card p-4 rounded-full w-fit">
                  {benefit.icon}
                </div>
                <CardTitle className="mt-4 text-primary">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
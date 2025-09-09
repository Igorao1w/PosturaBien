import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqItems = [
    {
        question: '¿Cómo elijo mi talla correcta?',
        answer: '👉 Consulta nuestra Guía rápida de tallas en esta misma página para elegir la medida adecuada.',
    },
    {
        question: '¿Cuánto tarda el envío?',
        answer: '👉 De 2 a 5 días hábiles en toda Colombia. El pago es contra entrega 💵.',
    },
    {
        question: '¿Debo pagar algo extra por el envío?',
        answer: '👉 No, el envío es totalmente gratis 🚚.',
    },
    {
        question: '¿Puedo pagar con tarjeta?',
        answer: '👉 Actualmente sólo manejamos pago contra entrega en efectivo al recibir tu pedido.',
    },
    {
        question: '¿Realmente corrige la postura?',
        answer: '👉 Sí ✅, ayuda a mantener tu espalda recta y reducir dolores. Miles de colombianos ya lo usan diariamente.',
    },
    {
        question: '¿Es incómodo o caluroso?',
        answer: '👉 Está hecho con materiales transpirables y ajustables. Lo puedes usar bajo la ropa sin problemas.',
    },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-16 sm:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">❓ Preguntas Frecuentes (FAQ)</h2>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg bg-card shadow-sm">
              <AccordionTrigger className="p-6 text-left font-semibold text-lg hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0 text-muted-foreground text-base">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

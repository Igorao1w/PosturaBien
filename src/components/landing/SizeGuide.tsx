import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const sizeData = [
  { size: 'S', height: '130-160', waist: '62-74', weight: '27-47' },
  { size: 'M', height: '150-170', waist: '72-84', weight: '45-55' },
  { size: 'L', height: '165-175', waist: '82-94', weight: '52-65' },
  { size: 'XL', height: '170-185', waist: '90-105', weight: '62-87' },
  { size: 'XXL', height: '180-195', waist: '95-118', weight: '87-97' },
];

export default function SizeGuide() {
  return (
    <section id="size-guide" className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">📐 Guía rápida de tallas</h2>
        </div>
        <div className="overflow-x-auto">
          <Table className="bg-card rounded-lg shadow-md">
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4 font-bold text-primary">Talla</TableHead>
                <TableHead className="w-1/4 font-bold text-primary">Altura (cm)</TableHead>
                <TableHead className="w-1/4 font-bold text-primary">Cintura (cm)</TableHead>
                <TableHead className="w-1/4 font-bold text-primary">Peso (kg)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sizeData.map((row) => (
                <TableRow key={row.size}>
                  <TableCell className="font-medium">{row.size}</TableCell>
                  <TableCell>{row.height}</TableCell>
                  <TableCell>{row.waist}</TableCell>
                  <TableCell>{row.weight}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="mt-6 text-center text-sm font-semibold text-foreground bg-card p-3 rounded-lg shadow-sm">
          ⚠️ Si estás entre dos tallas, elige la más grande para mayor comodidad.
        </p>
      </div>
    </section>
  );
}

import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-secondary py-6">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} PosturaBien. Todos los derechos reservados.</p>
        <p className="text-sm mt-1">Bogotá, Colombia</p>
      </div>
    </footer>
  );
}

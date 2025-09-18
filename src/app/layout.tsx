
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Script from 'next/script';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'PosturaBien | Mejora tu Postura, Alivia tu Dolor',
  description: 'Descubre el corrector de postura ortopédico de PosturaBien. Alivia el dolor de espalda, mejora tu postura y siéntete mejor cada día. Envío gratis y pago contra entrega en toda Colombia.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <head>
        <Script id="utmify-pixel" strategy="afterInteractive">
          {`
            window.pixelId = "68c8a0c49fa18ce3cc6f6e0a";
            var a = document.createElement("script");
            a.setAttribute("async", "");
            a.setAttribute("defer", "");
            a.setAttribute("src", "https://cdn.utmify.com/br/scripts/pixel/pixel.js");
            document.head.appendChild(a);
          `}
        </Script>
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

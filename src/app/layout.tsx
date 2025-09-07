import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Script from 'next/script';

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
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
        <audio id="confirmSound" preload="auto" src="https://www.dropbox.com/scl/fi/9nfxjuon0dfl9llq4a1qn/VID_20250905_210318.mp3?rlkey=ux95q7ahq1q4k46trudr3fsjy&st=gvurusmf&raw=1"></audio>
        <Script id="confirmation-sound" strategy="afterInteractive">
          {`
            (function(){
              var btn = document.querySelector('[data-confirm="true"]') 
                        || Array.from(document.querySelectorAll('button'))
                            .find(b => /CONFIRMAR PEDIDO|CONFIRMAR|PAGAR|PÍDELO/i.test(b.innerText));

              if (!btn) return;

              var audio = document.getElementById('confirmSound');
              if (audio) audio.volume = 0.6;

              btn.addEventListener('click', function(){
                if (!audio) return;
                try {
                  audio.pause();
                  audio.currentTime = 0;
                  setTimeout(function(){
                    audio.play().catch(function(e){ console.warn('Erro ao reproduzir áudio:', e); });
                  }, 50);
                } catch (e) {
                  console.warn('Erro no áudio:', e);
                }
              });
            })();
          `}
        </Script>
      </body>
    </html>
  );
}

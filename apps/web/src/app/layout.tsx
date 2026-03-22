import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Jost, Karla } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'
import { FloatingParticles } from '@/components/ui/animations/FloatingParticles'
import { CookieConsent } from '@/components/shared/cookie-consent'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
})

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600'],
})

const karla = Karla({
  subsets: ['latin'],
  variable: '--font-ui',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Rooftop Crest - Your Parenting Command Center',
  description: 'Expert-curated tasks, weekly briefings, and partner sync for pregnancy through early parenthood.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/images/logo-icon.svg', type: 'image/svg+xml' },
      { url: '/images/logo-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/images/logo-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/images/logo-180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Rooftop Crest',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#12100e',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var key='__stale_reload';
                window.addEventListener('error',function(e){
                  if(e.target&&(e.target.tagName==='SCRIPT'||e.target.tagName==='LINK')){
                    var src=e.target.src||e.target.href||'';
                    if(src.indexOf('/_next/')!==-1&&!sessionStorage.getItem(key)){
                      sessionStorage.setItem(key,'1');
                      console.log('[Recovery] Stale chunk detected, clearing caches and reloading...');
                      if('serviceWorker' in navigator){
                        navigator.serviceWorker.getRegistrations().then(function(r){
                          r.forEach(function(reg){reg.unregister();});
                        });
                      }
                      if('caches' in window){
                        caches.keys().then(function(n){
                          return Promise.all(n.map(function(name){return caches.delete(name);}));
                        }).then(function(){window.location.reload();});
                      }else{window.location.reload();}
                    }
                  }
                },true);
              })();
            `,
          }}
        />
      </head>
      <body className={`${playfair.variable} ${jost.variable} ${karla.variable} font-body antialiased`}>
        <Providers>
          <FloatingParticles count={12} />
          {children}
          <Toaster />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  )
}

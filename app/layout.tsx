import React from "react"
import type { Metadata } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

const _sans = Inter({ subsets: ["latin"] });
const _serif = Space_Grotesk({ subsets: ["latin"] });
const _mono = JetBrains_Mono({ subsets: ["latin"], variable: '--font-mono' });

export const metadata: Metadata = {
  title: {
    default: 'Gitbar | Il dopolavoro digitale degli sviluppatori',
    template: '%s | Gitbar Podcast'
  },
  description: 'Il circolo del dopolavoro degli sviluppatori e ingegneri del software. Chiacchiere su JavaScript, Rust, AI, DevOps, architetture e soft skills. Interviste con developer, dev rel e innovatori del mondo tech.',
  keywords: ['podcast', 'sviluppatori', 'developer', 'software engineering', 'javascript', 'rust', 'AI', 'devops', 'tech', 'programmazione', 'coding', 'web development', 'gitbar'],
  authors: [{ name: 'Gitbar' }],
  creator: 'Gitbar',
  publisher: 'Gitbar',
  metadataBase: new URL('https://gitbar.it'),
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': 'https://api.riverside.fm/hosting/B4uOwdEh.rss',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: 'https://gitbar.it',
    title: 'Gitbar | Il dopolavoro digitale degli sviluppatori',
    description: 'Il circolo del dopolavoro degli sviluppatori e ingegneri del software. Chiacchiere su JavaScript, Rust, AI, DevOps, architetture e soft skills.',
    siteName: 'Gitbar Podcast',
    images: [
      {
        url: '/images/podcast-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'Gitbar Podcast Cover',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gitbar | Il dopolavoro digitale degli sviluppatori',
    description: 'Il circolo del dopolavoro degli sviluppatori e ingegneri del software. Chiacchiere su JavaScript, Rust, AI, DevOps, architetture e soft skills.',
    images: ['/images/podcast-cover.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: '32x32',
      },
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it">
      <body className={`font-sans antialiased ${_mono.variable}`}>
        <a
          href="#main-content"
          className="absolute -top-10 left-0 bg-black text-white px-4 py-2 z-[100] focus:top-0 transition-all"
        >
          Salta al contenuto principale
        </a>
        {children}
        <Analytics />
        <Script id="matomo-analytics" strategy="afterInteractive">
          {`
            var _paq = window._paq = window._paq || [];
            _paq.push(['trackPageView']);
            _paq.push(['enableLinkTracking']);
            (function() {
              var u="https://matomo.rain1.it/";
              _paq.push(['setTrackerUrl', u+'matomo.php']);
              _paq.push(['setSiteId', '2']);
              var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
              g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
            })();
          `}
        </Script>
      </body>
    </html>
  )
}

import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/podcast/header'
import { Footer } from '@/components/podcast/footer'
import { fetchPodcastData } from '@/lib/rss-parser'
import { Coffee, Heart, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Supportaci - Gitbar',
  description: 'Supporta il podcast Gitbar con una donazione e aiutaci a continuare a produrre contenuti di qualità',
}

export default async function SupportPage() {
  const { info } = await fetchPodcastData()

  return (
    <div className="min-h-screen flex flex-col">
      <Header podcastTitle={info.title} />

      <main className="flex-1">
        <section className="py-12 md:py-16 lg:py-20 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Supporta Gitbar
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Se apprezzi il nostro lavoro, considera di offrirci un caffè (o una bolletta) ☕
              </p>
            </div>

            {/* PayPal Button */}
            <div className="flex justify-center mb-12">
              <Button size="lg" className="text-lg px-8 bg-[#0070ba] hover:bg-[#005ea6] text-white" asChild>
                <a
                  href="https://www.paypal.com/donate/?hosted_button_id=HGHZEH3GVSFQJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.032.17a.804.804 0 01-.794.68H7.72a.483.483 0 01-.477-.558L7.418 21h1.518l.95-6.02h1.385c4.678 0 7.75-2.203 8.796-6.502zm-2.96-5.09c.762.868.983 2.01.66 3.428-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.032.17a.804.804 0 01-.794.68H5.12a.483.483 0 01-.477-.558L6.72 3.388A.805.805 0 017.514 2.708h4.977c1.555 0 2.73.323 3.616.68z"/>
                  </svg>
                  Dona con PayPal
                </a>
              </Button>
            </div>

            {/* Invoice Card - Skeuomorphic Design */}
            <div className="mb-8 bg-white dark:bg-gray-50 shadow-2xl rounded-sm border border-gray-300 dark:border-gray-400 overflow-hidden relative" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.03) 2px, rgba(0,0,0,.03) 4px)',
            }}>
              {/* Invoice Header */}
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-200 dark:to-gray-300 px-8 py-6 border-b-2 border-gray-400">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-1" style={{ fontFamily: 'Courier New, monospace' }}>
                      FATTURA
                    </h2>
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'Courier New, monospace' }}>
                      N. #∞/2026
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600 uppercase tracking-wide">Data Emissione</p>
                    <p className="text-sm font-mono text-gray-800">{new Date().toLocaleDateString('it-IT')}</p>
                  </div>
                </div>
              </div>

              {/* Invoice Body */}
              <div className="px-8 py-6">
                {/* Parties */}
                <div className="grid grid-cols-2 gap-8 mb-8 pb-6 border-b border-dashed border-gray-400">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Emittente</p>
                    <p className="font-bold text-gray-800" style={{ fontFamily: 'Courier New, monospace' }}>
                      GITBAR PODCAST
                    </p>
                    <p className="text-sm text-gray-600 font-mono">P.IVA: ∞∞∞∞∞∞∞∞∞∞∞</p>
                    <p className="text-sm text-gray-600 font-mono">Internet, Cloud</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Destinatario</p>
                    <p className="font-bold text-gray-800" style={{ fontFamily: 'Courier New, monospace' }}>
                      COMMUNITY GITBAR
                    </p>
                    <p className="text-sm text-gray-600 font-mono">Ascoltatori straordinari</p>
                    <p className="text-sm text-gray-600 font-mono">Ovunque voi siate ❤️</p>
                  </div>
                </div>

                {/* Invoice Table */}
                <table className="w-full mb-6">
                  <thead>
                    <tr className="border-b-2 border-gray-800">
                      <th className="text-left py-2 text-xs text-gray-600 uppercase tracking-wide font-mono">Descrizione</th>
                      <th className="text-right py-2 text-xs text-gray-600 uppercase tracking-wide font-mono w-24">Q.tà</th>
                      <th className="text-right py-2 text-xs text-gray-600 uppercase tracking-wide font-mono w-32">Importo</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-sm">
                    <tr className="border-b border-gray-300">
                      <td className="py-3 text-gray-800">
                        <div className="font-semibold">Hosting Riverside.fm</div>
                        <div className="text-xs text-gray-600">Piano mensile per registrazioni professionali</div>
                      </td>
                      <td className="text-right text-gray-700">1</td>
                      <td className="text-right text-gray-800">€ 29,00</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-3 text-gray-800">
                        <div className="font-semibold">Abbonamento Canva</div>
                        <div className="text-xs text-gray-600">Design e grafica per contenuti social</div>
                      </td>
                      <td className="text-right text-gray-700">1</td>
                      <td className="text-right text-gray-800">€ 12,99</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-3 text-gray-800">
                        <div className="font-semibold">Abbonamento CapCut</div>
                        <div className="text-xs text-gray-600">Video editing per clip e shorts</div>
                      </td>
                      <td className="text-right text-gray-700">1</td>
                      <td className="text-right text-gray-800">€ 9,99</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-3 text-gray-800">
                        Ricarica Byteplus<div className="text-xs text-gray-600">Assistente AI per ricerca e contenuti</div>
                      </td>
                      <td className="text-right text-gray-700">1</td>
                      <td className="text-right text-gray-800">€ 20,00</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-3 text-gray-800">
                        <div className="font-semibold">Ricarica OpenRouter</div>
                        <div className="text-xs text-gray-600">API AI per automazioni e sperimentazioni</div>
                      </td>
                      <td className="text-right text-gray-700">1</td>
                      <td className="text-right text-gray-800">€ 20,00</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-3 text-gray-800">
                        <div className="font-semibold">Birre per le registrazioni</div>
                        <div className="text-xs text-gray-600">Carburante essenziale per creatività</div>
                      </td>
                      <td className="text-right text-gray-700">∞</td>
                      <td className="text-right text-gray-800">€ ∞</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-3 text-gray-800">
                        <div className="font-semibold">Tempo dedicato</div>
                        <div className="text-xs text-gray-600">Ricerca, registrazione, editing, pubblicazione</div>
                      </td>
                      <td className="text-right text-gray-700">∞h</td>
                      <td className="text-right text-gray-800 italic">Inestimabile</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-3 text-gray-800">
                        <div className="font-semibold">Passione e dedizione</div>
                        <div className="text-xs text-gray-600">100% gratuito per la community</div>
                      </td>
                      <td className="text-right text-gray-700">∞</td>
                      <td className="text-right text-green-700 font-bold">€ 0,00</td>
                    </tr>
                  </tbody>
                </table>

                {/* Totals */}
                <div className="border-t-2 border-gray-800 pt-4">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm text-gray-600 font-mono">Subtotale:</span>
                    <span className="text-sm text-gray-700 font-mono">€ ∞</span>
                  </div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm text-gray-600 font-mono">Sconto Community:</span>
                    <span className="text-sm text-green-700 font-mono">- 100%</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-3 border-t border-dashed border-gray-400">
                    <span className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Courier New, monospace' }}>
                      TOTALE DA PAGARE:
                    </span>
                    <span className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Courier New, monospace' }}>
                      Quanto vuoi tu! ❤️
                    </span>
                  </div>
                </div>

                {/* Footer Notes */}
                <div className="mt-6 pt-6 border-t border-gray-300">
                  <p className="text-xs text-gray-500 italic font-mono">
                    * Questa fattura è simbolica. Il podcast è e rimarrà sempre gratuito.<br />
                    * Ogni contributo è volontario e molto apprezzato per sostenere i costi di produzione.
                  </p>
                </div>
              </div>

              {/* Stamp Effect */}
              <div className="absolute top-20 right-8 opacity-20 rotate-12 pointer-events-none">
                <div className="border-4 border-red-600 rounded-lg px-6 py-3">
                  <p className="text-3xl font-bold text-red-600" style={{ fontFamily: 'Courier New, monospace' }}>
                    GRATUITO
                  </p>
                </div>
              </div>
            </div>

          
          </div>
        </section>
      </main>

      <Footer podcastTitle={info.title} />
    </div>
  )
}

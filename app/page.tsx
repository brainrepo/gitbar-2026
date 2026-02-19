import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/podcast/header"
import { Footer } from "@/components/podcast/footer"
import { EpisodeCard } from "@/components/podcast/episode-card"
import { fetchPodcastData } from "@/lib/rss-parser"
import { getEpisodeContent } from "@/lib/episode-content"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { generatePodcastSeriesSchema, generateOrganizationSchema, generateWebSiteSchema } from "@/lib/structured-data"

export default async function HomePage() {
  const { info, episodes } = await fetchPodcastData()
  const [latestEpisode, ...otherEpisodes] = episodes

  // Ottieni contenuto aggiuntivo per l'ultimo episodio (per ottenere l'URL YouTube se disponibile)
  const latestEpisodeContent = latestEpisode ? await getEpisodeContent(latestEpisode.number) : null

  const podcastSchema = generatePodcastSeriesSchema(info, episodes)
  const organizationSchema = generateOrganizationSchema()
  const websiteSchema = generateWebSiteSchema()

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(podcastSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Header podcastTitle={info.title} />

      <main className="flex-1">
        {/* Sezione Hero */}
        <section className="py-16 md:py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-base font-bold text-foreground/90 mb-4 tracking-normal uppercase">
                  Il dopolavoro digitale degli sviluppatori
                </p>
                <h1 className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-6 text-balance tracking-tight">
                  {info.title}
                </h1>
                <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-lg">
                Chiacchiere sincere tra quelli che una volta erano developer e oggi si chiedono se il codice lo stiamo ancora scrivendo noi o se siamo diventati i <strong>prompt-sitter</strong> di intelligenze artificiali capricciose. Le bestemmie, almeno quelle, restano artigianali e 100% umane.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                    <Link href="/episodes">Sfoglia Episodi</Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
                  <iframe
                    src="https://www.youtube.com/embed/2y1qxHtN_58"
                    title={info.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl p-4 shadow-lg">
                  <p className="text-xs text-muted-foreground mb-1">Episodi</p>
                  <p className="font-serif text-2xl text-foreground">{episodes.length}</p>
                </div>
                <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground rounded-full px-4 py-2 text-sm font-medium shadow-lg">
                  Nuovo Episodio
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Episodio in Evidenza */}
        {latestEpisode && (
          <section className="py-16 px-6 bg-secondary/50">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-serif text-3xl text-foreground mb-8">Ultimo Episodio</h2>
              <EpisodeCard
                episode={latestEpisode}
                featured
                youtubeUrl={latestEpisodeContent?.youtubeUrl}
              />
            </div>
          </section>
        )}

        {/* Griglia Episodi */}
        {otherEpisodes.length > 0 && (
          <section className="py-16 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-3xl text-foreground">Altri Episodi</h2>
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground" asChild>
                  <Link href="/episodes">Vedi Tutti</Link>
                </Button>
              </div>
              <div className="flex flex-col gap-4">
                {otherEpisodes.slice(0, 4).map((episode) => (
                  <EpisodeCard key={episode.id} episode={episode} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Sezione Chi Siamo */}
        <section id="about" className="py-16 px-6 bg-secondary/50">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6 text-balance">
                  Il circolo del dopolavoro degli sviluppatori
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Gitbar è il circolo del dopolavoro degli sviluppatori e ingegneri del software, dove la birra anche se virtuale è esentasse. Qui si chiacchiera di tutto: JavaScript e del suo ecosistema che cambia framework prima che finisci il caffè, Rust e della sua community che ti fa sentire inadeguato solo perché non hai riscritto il progetto per la terza volta, AI, DevOps, architetture, soft skills e blockchain (quella cosa che sta bene su tutto come il prezzemolo). Interviste con developer, dev rel e chiunque abbia storie interessanti da raccontare sul mondo dello sviluppo software.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Non ci prendiamo mai sul serio. Zero atteggiamenti da guru, zero formalità. Solo conversazioni oneste tra persone che scrivono codice, sbagliano, imparano e ogni tanto si domandano perché hanno scelto questa professione (per poi ricordarsi che è bellissima).
                </p>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="font-serif text-3xl text-foreground">{episodes.length}</p>
                    <p className="text-sm text-muted-foreground">Episodi</p>
                  </div>
                  <div className="w-px h-12 bg-border" />
                  <div>
                    <p className="font-serif text-3xl text-foreground">Settimanale</p>
                    <p className="text-sm text-muted-foreground">Nuovi Episodi</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                  <Image
                    src={info.image || "/images/podcast-cover.jpg"}
                    alt={info.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Telegram */}
        <section id="subscribe" className="py-16 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4 text-balance">
              Unisciti alla community
            </h2>
            <p className="text-muted-foreground mb-8">
              Entra nel gruppo Telegram di Gitbar per discutere degli episodi, condividere idee e connetterti con altri developer appassionati.
            </p>
            <div className="flex justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <a
                  href="https://t.me/+TIRZVmcXiA_2s7NE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.12.099.154.232.17.326.016.094.037.308.02.475z"/>
                  </svg>
                  Unisciti su Telegram
                </a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Community aperta a tutti. Discutiamo di tech, coding e innovazione.
            </p>
          </div>
        </section>
      </main>

      <Footer podcastTitle={info.title} />
    </div>
  )
}

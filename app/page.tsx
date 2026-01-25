import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/podcast/header"
import { Footer } from "@/components/podcast/footer"
import { EpisodeCard } from "@/components/podcast/episode-card"
import { fetchPodcastData } from "@/lib/rss-parser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default async function HomePage() {
  const { info, episodes } = await fetchPodcastData()
  const [latestEpisode, ...otherEpisodes] = episodes

  return (
    <div className="min-h-screen flex flex-col">
      <Header podcastTitle={info.title} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
                  Un podcast per i curiosi
                </p>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-6 text-balance">
                  {info.title}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
                  {info.description.substring(0, 200)}{info.description.length > 200 ? "..." : ""}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Ascolta Ora
                  </Button>
                  <Button size="lg" variant="outline" className="border-border hover:bg-secondary bg-transparent" asChild>
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

        {/* Featured Episode */}
        {latestEpisode && (
          <section className="py-16 px-6 bg-secondary/50">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-serif text-3xl text-foreground mb-8">Ultimo Episodio</h2>
              <EpisodeCard episode={latestEpisode} featured />
            </div>
          </section>
        )}

        {/* Episode Grid */}
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

        {/* About Section */}
        <section id="about" className="py-16 px-6 bg-secondary/50">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6 text-balance">
                  Storie che ispirano, idee che contano
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {info.description}
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Condotto da {info.author}, ogni episodio è un invito a esplorare le profondità dell'esperienza umana attraverso conversazioni stimolanti.
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

        {/* Newsletter */}
        <section id="subscribe" className="py-16 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4 text-balance">
              Non perdere nessun episodio
            </h2>
            <p className="text-muted-foreground mb-8">
              Iscriviti alla nostra newsletter per ricevere notifiche sui nuovi episodi, contenuti esclusivi e aggiornamenti dal backstage.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Inserisci la tua email"
                className="bg-card border-border"
              />
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0">
                Iscriviti
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-4">
              Niente spam, puoi cancellarti in qualsiasi momento.
            </p>
          </div>
        </section>
      </main>

      <Footer podcastTitle={info.title} />
    </div>
  )
}

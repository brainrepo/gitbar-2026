import { Header } from "@/components/podcast/header"
import { Footer } from "@/components/podcast/footer"
import { EpisodeCard } from "@/components/podcast/episode-card"
import { fetchPodcastData } from "@/lib/rss-parser"

export default async function EpisodesPage() {
  const { info, episodes } = await fetchPodcastData()

  return (
    <div className="min-h-screen flex flex-col">
      <Header podcastTitle={info.title} />

      <main className="flex-1">
        {/* Intestazione Pagina */}
        <section className="py-12 md:py-16 px-6 bg-secondary/50">
          <div className="max-w-6xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4 text-balance">
              Tutti gli Episodi
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Esplora la nostra collezione completa di {episodes.length} episodi. Ogni conversazione è pensata per ispirare, educare e stimolare nuove idee.
            </p>
          </div>
        </section>

        {/* Lista Episodi */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Conteggio Episodi */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-muted-foreground">
                Visualizzati {episodes.length} episodi
              </p>
            </div>

            {/* Lista Episodi */}
            <div className="flex flex-col gap-4">
              {episodes.map((episode) => (
                <EpisodeCard key={episode.id} episode={episode} />
              ))}
            </div>

            {/* Stato Vuoto */}
            {episodes.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">Nessun episodio trovato.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer podcastTitle={info.title} />
    </div>
  )
}

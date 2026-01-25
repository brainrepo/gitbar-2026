import { Header } from "@/components/podcast/header"
import { Footer } from "@/components/podcast/footer"
import { EpisodeCard } from "@/components/podcast/episode-card"
import { fetchPodcastData } from "@/lib/rss-parser"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useSearchParams } from "next/navigation"
import Loading from "./loading"

export default async function EpisodesPage() {
  const { info, episodes } = await fetchPodcastData()

  return (
    <div className="min-h-screen flex flex-col">
      <Header podcastTitle={info.title} />

      <main className="flex-1">
        {/* Page Header */}
        <section className="py-12 md:py-16 px-6 bg-secondary/50">
          <div className="max-w-6xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4 text-balance">
              All Episodes
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-8">
              Browse our complete collection of {episodes.length} episodes. Each conversation is designed to inspire, educate, and spark new ideas.
            </p>
            
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search episodes..."
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>
        </section>

        {/* Episodes List */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Episode Count */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-muted-foreground">
                Showing {episodes.length} episodes
              </p>
            </div>

            {/* Episodes List */}
            <div className="flex flex-col gap-4">
              {episodes.map((episode) => (
                <EpisodeCard key={episode.id} episode={episode} />
              ))}
            </div>

            {/* Empty State */}
            {episodes.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No episodes found.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer podcastTitle={info.title} />
    </div>
  )
}

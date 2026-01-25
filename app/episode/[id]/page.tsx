import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react"
import { Header } from "@/components/podcast/header"
import { Footer } from "@/components/podcast/footer"
import { AudioPlayer } from "@/components/podcast/audio-player"
import { EpisodeCard } from "@/components/podcast/episode-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fetchPodcastData, getEpisodeById } from "@/lib/rss-parser"

interface EpisodePageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const { episodes } = await fetchPodcastData()
  return episodes.map((episode) => ({
    id: episode.id,
  }))
}

export async function generateMetadata({ params }: EpisodePageProps) {
  const { id } = await params
  const { episodes, info } = await fetchPodcastData()
  const episode = getEpisodeById(episodes, id)
  
  if (!episode) {
    return { title: "Episode Not Found" }
  }

  return {
    title: `${episode.title} | ${info.title}`,
    description: episode.description,
  }
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { id } = await params
  const { episodes, info } = await fetchPodcastData()
  const episode = getEpisodeById(episodes, id)

  if (!episode) {
    notFound()
  }

  const relatedEpisodes = episodes.filter((ep) => ep.id !== episode.id).slice(0, 3)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header podcastTitle={info.title} />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-8 md:py-12 px-6 bg-secondary/50">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all episodes
            </Link>

            <div className="grid md:grid-cols-[200px_1fr] gap-8 items-start">
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <Image
                  src={episode.guest.image || "/placeholder.svg"}
                  alt={episode.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <p className="text-sm text-primary font-medium mb-2">
                  Episode {episode.number}
                </p>
                <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4 text-balance">
                  {episode.title}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {episode.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(episode.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {episode.duration}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {episode.topics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="font-normal">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Audio Player */}
        <section className="py-8 px-6 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <AudioPlayer
              title={episode.title}
              episodeNumber={episode.number}
              audioUrl={episode.audioUrl}
            />
          </div>
        </section>

        {/* Content */}
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-[1fr_280px] gap-12">
              {/* Show Notes */}
              <div>
                <h2 className="font-serif text-2xl text-foreground mb-6">
                  Show Notes
                </h2>
                <div className="prose prose-neutral max-w-none">
                  {episode.showNotes.split("\n\n").map((paragraph, index) => {
                    if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                      return (
                        <h3 key={index} className="font-serif text-lg text-foreground mt-8 mb-3">
                          {paragraph.replace(/\*\*/g, "")}
                        </h3>
                      )
                    }
                    if (paragraph.startsWith("- ")) {
                      const items = paragraph.split("\n")
                      return (
                        <ul key={index} className="space-y-2 mb-6">
                          {items.map((item, i) => (
                            <li key={i} className="text-muted-foreground leading-relaxed">
                              {item.replace("- ", "")}
                            </li>
                          ))}
                        </ul>
                      )
                    }
                    return (
                      <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    )
                  })}
                </div>
              </div>

              {/* Sidebar */}
              <aside className="space-y-8">
                {/* Host Info */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    Hosted by
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src={info.image || "/placeholder.svg"}
                      alt={info.author}
                      width={56}
                      height={56}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-foreground">{info.author}</p>
                      <p className="text-sm text-muted-foreground">Host</p>
                    </div>
                  </div>
                </div>

                {/* Share */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    Share this Episode
                  </h3>
                  <Button variant="outline" className="w-full justify-center gap-2 bg-transparent">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>

                {/* Listen On */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    Listen On
                  </h3>
                  <div className="space-y-3">
                    <a
                      href="#"
                      className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                      </div>
                      Spotify
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0H5.34zm6.525 2.568c4.988 0 9.03 4.043 9.03 9.03 0 4.988-4.042 9.03-9.03 9.03-4.987 0-9.03-4.042-9.03-9.03 0-4.987 4.043-9.03 9.03-9.03zm-.003 1.543a7.487 7.487 0 100 14.975 7.487 7.487 0 000-14.975zm-.008 2.382c2.806 0 5.088 2.282 5.088 5.088 0 2.806-2.282 5.088-5.088 5.088-2.806 0-5.088-2.282-5.088-5.088 0-2.806 2.282-5.088 5.088-5.088zm-.016 2.117a2.97 2.97 0 100 5.94 2.97 2.97 0 000-5.94z"/>
                        </svg>
                      </div>
                      Apple Podcasts
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </div>
                      YouTube
                    </a>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Related Episodes */}
        {relatedEpisodes.length > 0 && (
          <section className="py-16 px-6 bg-secondary/50">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-serif text-2xl text-foreground mb-8">
                More Episodes
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedEpisodes.map((ep) => (
                  <EpisodeCard key={ep.id} episode={ep} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer podcastTitle={info.title} />
    </div>
  )
}

import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Share2, Youtube } from "lucide-react"
import { Header } from "@/components/podcast/header"
import { Footer } from "@/components/podcast/footer"
import { AudioPlayer } from "@/components/podcast/audio-player"
import { EpisodeCard } from "@/components/podcast/episode-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fetchPodcastData, getEpisodeById } from "@/lib/rss-parser"
import { getEpisodeContent, getEpisodeTranscript } from "@/lib/episode-content"
import ReactMarkdown from "react-markdown"
import { generatePodcastEpisodeSchema } from "@/lib/structured-data"

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
    return { title: "Episodio Non Trovato" }
  }

  const episodeUrl = `https://gitbar.it/episode/${episode.id}`
  const imageUrl = episode.guest.image || info.image

  return {
    title: episode.title,
    description: episode.description,
    keywords: [...episode.topics, 'podcast', 'gitbar', 'developer', 'tech'],
    authors: [{ name: info.author }],
    alternates: {
      canonical: `/episode/${episode.id}`,
    },
    openGraph: {
      type: 'music.song',
      locale: 'it_IT',
      url: episodeUrl,
      title: episode.title,
      description: episode.description,
      siteName: info.title,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: episode.title,
        },
      ],
      audio: episode.audioUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: episode.title,
      description: episode.description,
      images: [imageUrl],
    },
  }
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { id } = await params
  const { episodes, info } = await fetchPodcastData()
  const episode = getEpisodeById(episodes, id)

  if (!episode) {
    notFound()
  }

  // Ottieni contenuto aggiuntivo
  const episodeContent = await getEpisodeContent(episode.number)
  const episodeTranscript = await getEpisodeTranscript(episode.number)

  const relatedEpisodes = episodes.filter((ep) => ep.id !== episode.id).slice(0, 3)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Estrai l'ID del video YouTube dall'URL
  const getYouTubeVideoId = (url: string): string | null => {
    try {
      const urlObj = new URL(url)
      if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1)
      }
      if (urlObj.hostname.includes('youtube.com')) {
        return urlObj.searchParams.get('v')
      }
    } catch {
      return null
    }
    return null
  }

  const youtubeVideoId = episodeContent?.youtubeUrl ? getYouTubeVideoId(episodeContent.youtubeUrl) : null

  const episodeSchema = generatePodcastEpisodeSchema(episode, info)

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(episodeSchema) }}
      />
      <Header podcastTitle={info.title} />

      <main className="flex-1">
        {/* Sezione Hero */}
        <section className="py-8 md:py-12 px-6 bg-secondary/50">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Torna a tutti gli episodi
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
                  Episodio {episode.number}
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

        {/* Video YouTube */}
        {youtubeVideoId && (
          <section className="py-8 px-6 border-b border-border bg-secondary/30">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-serif text-2xl text-foreground mb-6">
                Guarda su YouTube
              </h2>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-xl"
                  src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                  title={episode.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </section>
        )}

        {/* Lettore Audio */}
        <section className="py-8 px-6 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <AudioPlayer
              title={episode.title}
              episodeNumber={episode.number}
              audioUrl={episode.audioUrl}
            />
          </div>
        </section>

        {/* Contenuto */}
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-[1fr_280px] gap-12">
              {/* Note dell'Episodio */}
              <div>
                <h2 className="font-serif text-2xl text-foreground mb-6">
                  Note dell'Episodio
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

                {/* Descrizione Estesa */}
                {episodeContent && (
                  <div className="mt-12 pt-12 border-t border-border">
                    <div className="prose prose-lg prose-neutral max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-strong:text-foreground prose-ul:text-muted-foreground prose-ul:my-6 prose-li:my-2 prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none">
                      <ReactMarkdown
                        components={{
                          h1: ({children}) => (
                            <h1 className="font-serif text-3xl text-foreground mt-8 mb-6 pb-3 border-b border-border">
                              {children}
                            </h1>
                          ),
                          h2: ({children}) => (
                            <h2 className="font-serif text-2xl text-foreground mt-10 mb-5">
                              {children}
                            </h2>
                          ),
                          h3: ({children}) => (
                            <h3 className="font-serif text-xl text-foreground mt-8 mb-4 flex items-center gap-2">
                              <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
                              {children}
                            </h3>
                          ),
                          h4: ({children}) => (
                            <h4 className="font-serif text-lg text-foreground mt-6 mb-3">
                              {children}
                            </h4>
                          ),
                        }}
                      >
                        {episodeContent.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Trascrizione */}
                {episodeTranscript && (
                  <div className="mt-12 pt-12 border-t border-border">
                    <h2 className="font-serif text-2xl text-foreground mb-6">
                      Trascrizione
                    </h2>
                    {(() => {
                      // Funzione helper per formattare il testo con interruzioni di riga dopo i punti
                      const formatTextWithLineBreaks = (text: string) => {
                        // Dividi su ". " (punto seguito da spazio) ma mantieni il punto
                        const sentences = text.split(/(\. )/g).reduce((acc: string[], part, i) => {
                          if (part === '. ' && i > 0) {
                            // Aggiungi il punto alla frase precedente
                            acc[acc.length - 1] += part.trim()
                          } else if (part.trim()) {
                            acc.push(part)
                          }
                          return acc
                        }, [])

                        return sentences.map((sentence, i) => (
                          <span key={i} className="block mb-2">
                            {sentence}
                          </span>
                        ))
                      }

                      // Controlla se questo è un monologo (singolo segmento con speaker/timestamp predefiniti)
                      const isMonologue = episodeTranscript.segments.length === 1 &&
                                         episodeTranscript.segments[0].speaker === "Host" &&
                                         episodeTranscript.segments[0].timestamp === "00:00"

                      if (isMonologue) {
                        // Visualizza come testo semplice per i monologhi con font-mono
                        return (
                          <div className="prose prose-lg prose-neutral max-w-none">
                            <div className="text-muted-foreground leading-relaxed font-mono text-sm">
                              {formatTextWithLineBreaks(episodeTranscript.segments[0].text)}
                            </div>
                          </div>
                        )
                      }

                      // Visualizza con speaker/timestamp per le conversazioni
                      return (
                        <div className="space-y-6">
                          {episodeTranscript.segments.map((segment, index) => (
                            <div key={index} className="flex gap-4">
                              <div className="flex-shrink-0">
                                <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-secondary border border-border text-xs font-mono text-foreground font-medium">
                                  {segment.timestamp}
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-foreground mb-1 uppercase tracking-wide">
                                  {segment.speaker}
                                </p>
                                <div className="text-muted-foreground leading-relaxed font-mono text-sm">
                                  {formatTextWithLineBreaks(segment.text)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>

              {/* Barra Laterale */}
              <aside className="space-y-8">
                {/* Informazioni Conduttore */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    Condotto da
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
                      <p className="text-sm text-muted-foreground">Conduttore</p>
                    </div>
                  </div>
                </div>

                {/* Condivisione */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    Condividi questo Episodio
                  </h3>
                  <Button variant="outline" className="w-full justify-center gap-2 bg-transparent">
                    <Share2 className="w-4 h-4" />
                    Condividi
                  </Button>
                </div>

                {/* Link YouTube */}
                {episodeContent?.youtubeUrl && (
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">
                      Guarda su YouTube
                    </h3>
                    <a
                      href={episodeContent.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <Youtube className="w-5 h-5" />
                      Apri su YouTube
                    </a>
                  </div>
                )}

                {/* Ascolta Su */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    Ascolta su
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

        {/* Episodi Correlati */}
        {relatedEpisodes.length > 0 && (
          <section className="py-16 px-6 bg-secondary/50">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-serif text-2xl text-foreground mb-8">
                Altri Episodi
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

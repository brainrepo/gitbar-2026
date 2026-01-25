import Link from "next/link"
import Image from "next/image"
import { Play, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Episode } from "@/lib/rss-parser"

interface EpisodeCardProps {
  episode: Episode
  featured?: boolean
}

export function EpisodeCard({ episode, featured = false }: EpisodeCardProps) {
  if (featured) {
    return (
      <Link href={`/episode/${episode.id}`} className="group block">
        <article className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
          <div className="grid md:grid-cols-[400px_1fr] gap-0">
            <div className="relative aspect-square max-h-[400px]">
              <Image
                src={episode.guest.image || "/placeholder.svg"}
                alt={episode.guest.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
              <div className="absolute bottom-4 left-4 md:hidden">
                <span className="text-xs font-medium text-card bg-primary px-2 py-1 rounded-full">
                  Latest Episode
                </span>
              </div>
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <div className="hidden md:block mb-3">
                <span className="text-xs font-medium text-primary-foreground bg-primary px-3 py-1 rounded-full">
                  Latest Episode
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Episode {episode.number}
              </p>
              <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-3 group-hover:text-primary transition-colors text-balance">
                {episode.title}
              </h3>
              <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                {episode.description}
              </p>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src={episode.guest.image || "/placeholder.svg"}
                  alt={episode.guest.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{episode.guest.name}</p>
                  <p className="text-xs text-muted-foreground">{episode.guest.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {episode.duration}
                </span>
                <span className="flex items-center gap-1.5 text-primary font-medium group-hover:underline">
                  <Play className="w-4 h-4 fill-primary" />
                  Listen Now
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/episode/${episode.id}`} className="group block">
      <article className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-md">
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-32 md:w-40 h-32 sm:h-auto flex-shrink-0">
            <Image
              src={episode.guest.image || "/placeholder.svg"}
              alt={episode.guest.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4 md:p-5 flex flex-col justify-center flex-1 min-w-0">
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
              <span>Ep. {episode.number}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {episode.duration}
              </span>
            </div>
            <h3 className="font-serif text-base md:text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1 text-balance">
              {episode.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {episode.description}
            </p>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <Image
                  src={episode.guest.image || "/placeholder.svg"}
                  alt={episode.guest.name}
                  width={24}
                  height={24}
                  className="rounded-full object-cover flex-shrink-0"
                />
                <span className="text-xs text-muted-foreground truncate">{episode.guest.name}</span>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-primary font-medium flex-shrink-0">
                <Play className="w-3 h-3 fill-primary" />
                Play
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

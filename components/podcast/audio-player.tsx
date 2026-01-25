"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

interface AudioPlayerProps {
  title: string
  episodeNumber: number
  audioUrl?: string
}

export function AudioPlayer({ title, episodeNumber, audioUrl }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handleCanPlay = () => {
      setIsLoading(false)
    }

    const handleWaiting = () => {
      setIsLoading(true)
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("canplay", handleCanPlay)
    audio.addEventListener("waiting", handleWaiting)

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("canplay", handleCanPlay)
      audio.removeEventListener("waiting", handleWaiting)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Carica la sorgente audio solo quando l'utente interagisce per la prima volta
    if (hasUserInteracted && audioUrl && !audio.src) {
      setIsLoading(true)
      audio.src = audioUrl
      audio.load()
    }

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [isPlaying, hasUserInteracted, audioUrl])

  // Configura l'API Media Session per i controlli nativi
  useEffect(() => {
    if (!('mediaSession' in navigator) || !hasUserInteracted) return

    navigator.mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: 'GitBar Podcast',
      album: `Episodio ${episodeNumber}`,
      artwork: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ]
    })

    navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true))
    navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false))
    navigator.mediaSession.setActionHandler('seekbackward', () => skipBack())
    navigator.mediaSession.setActionHandler('seekforward', () => skipForward())
    navigator.mediaSession.setActionHandler('previoustrack', null)
    navigator.mediaSession.setActionHandler('nexttrack', null)

    return () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', null)
        navigator.mediaSession.setActionHandler('pause', null)
        navigator.mediaSession.setActionHandler('seekbackward', null)
        navigator.mediaSession.setActionHandler('seekforward', null)
      }
    }
  }, [title, episodeNumber, hasUserInteracted])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = isMuted ? 0 : volume / 100
  }, [volume, isMuted])

  const formatTime = (seconds: number) => {
    if (!seconds || !isFinite(seconds)) return "0:00"
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    if (value[0] === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const skipBack = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, audio.currentTime - 15)
  }

  const skipForward = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.min(duration, audio.currentTime + 30)
  }

  const togglePlay = () => {
    // Segna che l'utente ha interagito (per attivare il caricamento audio)
    if (!hasUserInteracted) {
      setHasUserInteracted(true)
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      {/* Elemento audio con caricamento lazy - src è impostato programmaticamente al primo play */}
      <audio ref={audioRef} preload="none" />

      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-serif text-lg">
          {episodeNumber}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-1">In Riproduzione</p>
          <h3 className="font-serif text-lg text-foreground truncate">{title}</h3>
        </div>
      </div>

      {/* Barra di Progresso */}
      <div className="mb-4">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={1}
          onValueChange={handleSeek}
          className="cursor-pointer"
          disabled={!audioUrl}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controlli */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={skipBack}
            className="text-muted-foreground hover:text-foreground"
            disabled={!audioUrl}
          >
            <SkipBack className="w-5 h-5" />
            <span className="sr-only">Indietro di 15 secondi</span>
          </Button>

          <Button
            size="icon"
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={!audioUrl || isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
            <span className="sr-only">{isPlaying ? "Pausa" : "Riproduci"}</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={skipForward}
            className="text-muted-foreground hover:text-foreground"
            disabled={!audioUrl}
          >
            <SkipForward className="w-5 h-5" />
            <span className="sr-only">Avanti di 30 secondi</span>
          </Button>
        </div>

        {/* Volume */}
        <div className="hidden sm:flex items-center gap-2 w-32">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="text-muted-foreground hover:text-foreground shrink-0"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
            <span className="sr-only">{isMuted ? "Riattiva audio" : "Silenzia"}</span>
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Heart } from "lucide-react"
import { useState } from "react"

interface HeaderProps {
  podcastTitle?: string
}

export function Header({ podcastTitle = "The Quiet Hour" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl tracking-tight text-foreground">
          {podcastTitle}
        </Link>

        {/* Navigazione Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/episodes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Episodi
          </Link>
          <Link href="/speakers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Speaker
          </Link>
          <Button size="sm" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all animate-pulse">
            <Link href="/supportaci" className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 fill-current" />
              Supportaci
            </Link>
          </Button>
        </nav>

        {/* Pulsante Menu Mobile */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Apri/Chiudi menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigazione Mobile */}
      {menuOpen && (
        <nav className="md:hidden border-t border-border bg-background px-6 py-4 space-y-4">
          <Link href="/episodes" className="block text-sm text-foreground" onClick={() => setMenuOpen(false)}>
            Episodi
          </Link>
          <Link href="/speakers" className="block text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>
            Speaker
          </Link>
          <Button size="sm" asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all animate-pulse">
            <Link href="/supportaci" className="flex items-center justify-center gap-1.5" onClick={() => setMenuOpen(false)}>
              <Heart className="w-4 h-4 fill-current" />
              Supportaci
            </Link>
          </Button>
        </nav>
      )}
    </header>
  )
}

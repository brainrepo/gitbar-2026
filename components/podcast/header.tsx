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
        <nav className="hidden md:flex items-center gap-8" aria-label="Navigazione principale">
          <ul className="flex items-center gap-8 list-none m-0 p-0">
            <li>
              <Link href="/episodes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Episodi
              </Link>
            </li>
            <li>
              <Button size="sm" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all animate-pulse">
                <Link href="/supportaci" className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 fill-current" />
                  Supportaci
                </Link>
              </Button>
            </li>
          </ul>
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
        <nav className="md:hidden border-t border-border bg-background px-6 py-4" aria-label="Navigazione principale">
          <ul className="space-y-4 list-none m-0 p-0">
            <li>
              <Link href="/episodes" className="block text-sm text-foreground" onClick={() => setMenuOpen(false)}>
                Episodi
              </Link>
            </li>
            <li>
              <Link href="/speakers" className="block text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>
                Speaker
              </Link>
            </li>
            <li>
              <Button size="sm" asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all animate-pulse">
                <Link href="/supportaci" className="flex items-center justify-center gap-1.5" onClick={() => setMenuOpen(false)}>
                  <Heart className="w-4 h-4 fill-current" />
                  Supportaci
                </Link>
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}

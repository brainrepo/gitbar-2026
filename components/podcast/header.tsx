"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
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

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/episodes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Episodi
          </Link>
          <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Chi Siamo
          </Link>
          <Link href="#subscribe" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Iscriviti
          </Link>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Ultimo Episodio
          </Button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="md:hidden border-t border-border bg-background px-6 py-4 space-y-4">
          <Link href="/episodes" className="block text-sm text-foreground" onClick={() => setMenuOpen(false)}>
            Episodi
          </Link>
          <Link href="#about" className="block text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>
            Chi Siamo
          </Link>
          <Link href="#subscribe" className="block text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>
            Iscriviti
          </Link>
          <Button size="sm" className="w-full bg-primary text-primary-foreground">
            Ultimo Episodio
          </Button>
        </nav>
      )}
    </header>
  )
}

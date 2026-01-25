# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 podcast website built with React 19, TypeScript, and Tailwind CSS 4. The site dynamically fetches podcast episodes from an RSS feed (Riverside.fm) and presents them in a modern, responsive interface. The project uses the App Router with server components and static generation for optimal performance.

## Commands

### Development
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production (TypeScript errors are ignored via next.config.mjs)
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

### RSS Feed Integration
The core data fetching happens in `lib/rss-parser.ts`, which:
- Fetches podcast data from `https://api.riverside.fm/hosting/B4uOwdEh.rss`
- Parses RSS XML manually (browser-compatible, no Node dependencies)
- Caches data for 1 hour using Next.js's `revalidate` option
- Generates slugs from episode titles for dynamic routes
- Extracts topics, formats durations, and strips HTML from descriptions

### Data Types
Core interfaces defined in `lib/rss-parser.ts`:
- `PodcastInfo`: Overall podcast metadata (title, description, image, author, link)
- `Episode`: Individual episode data (id, number, title, description, guest, duration, publishedAt, audioUrl, topics, showNotes)
- `PodcastData`: Combined structure with info and episodes array

### Page Structure
- **`app/page.tsx`**: Homepage with hero section, latest episode, episode grid, about section, and newsletter signup
- **`app/episodes/page.tsx`**: All episodes listing with search UI
- **`app/episode/[id]/page.tsx`**: Individual episode detail page with audio player, show notes, and related episodes
  - Uses `generateStaticParams()` to pre-render all episode pages at build time
  - Dynamic route based on episode slug/id

### Component Organization
- **`components/ui/`**: shadcn/ui components (buttons, inputs, cards, etc.) - uses "new-york" style variant
- **`components/podcast/`**: Custom podcast-specific components
  - `header.tsx`: Site navigation
  - `footer.tsx`: Site footer
  - `episode-card.tsx`: Episode preview card with featured variant
  - `audio-player.tsx`: Custom audio player component
- **`components/theme-provider.tsx`**: Theme context provider

### Styling
- **Tailwind CSS 4** with Tailwind CSS PostCSS plugin (`@tailwindcss/postcss`)
- Custom CSS variables defined in `app/globals.css` for theme colors
- Path aliases configured via `tsconfig.json`: `@/*` maps to project root
- shadcn/ui configuration in `components.json` with path aliases for components, utils, ui, lib, and hooks

### Fonts
- Inter (sans-serif) and Space Grotesk (serif) from Google Fonts
- Configured in `app/layout.tsx` with font-sans and font-serif classes

### Next.js Configuration
- TypeScript build errors ignored (`ignoreBuildErrors: true`)
- Images unoptimized (`unoptimized: true`)
- Vercel Analytics integrated via `@vercel/analytics/next`

### State Management
- Uses React Server Components for data fetching
- Custom hooks in `hooks/`:
  - `use-mobile.ts`: Responsive breakpoint detection
  - `use-toast.ts`: Toast notification system

### Key Patterns
- Server-side data fetching with automatic caching and revalidation
- Static generation for all episode pages via `generateStaticParams()`
- Dynamic metadata generation per page via `generateMetadata()`
- Italian language content (UI text is in Italian)

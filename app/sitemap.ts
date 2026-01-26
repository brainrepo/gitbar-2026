import { MetadataRoute } from 'next'
import { fetchPodcastData } from '@/lib/rss-parser'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { episodes } = await fetchPodcastData()
  const baseUrl = 'https://gitbar.it'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/episodes`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  // Dynamic episode pages
  const episodePages: MetadataRoute.Sitemap = episodes.map((episode) => ({
    url: `${baseUrl}/episode/${episode.id}`,
    lastModified: new Date(episode.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...episodePages]
}

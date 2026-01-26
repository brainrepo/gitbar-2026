import type { Episode, PodcastInfo } from './rss-parser'

export function generatePodcastSeriesSchema(info: PodcastInfo, episodes: Episode[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'PodcastSeries',
    name: info.title,
    description: info.description,
    url: 'https://gitbar.it',
    author: {
      '@type': 'Person',
      name: info.author,
    },
    image: info.image,
    webFeed: 'https://api.riverside.fm/hosting/B4uOwdEh.rss',
    numberOfEpisodes: episodes.length,
  }
}

export function generatePodcastEpisodeSchema(episode: Episode, podcastInfo: PodcastInfo) {
  return {
    '@context': 'https://schema.org',
    '@type': 'PodcastEpisode',
    url: `https://gitbar.it/episode/${episode.id}`,
    name: episode.title,
    description: episode.description,
    datePublished: episode.publishedAt,
    duration: episode.duration,
    episodeNumber: episode.number,
    associatedMedia: {
      '@type': 'MediaObject',
      contentUrl: episode.audioUrl,
    },
    partOfSeries: {
      '@type': 'PodcastSeries',
      name: podcastInfo.title,
      url: 'https://gitbar.it',
    },
    image: episode.guest.image,
  }
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gitbar',
    url: 'https://gitbar.it',
    logo: 'https://gitbar.it/icon.svg',
    sameAs: [
      'https://t.me/gitbar',
      'https://www.youtube.com/@gitbar',
    ],
  }
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Gitbar Podcast',
    url: 'https://gitbar.it',
    description: 'Il circolo del dopolavoro degli sviluppatori e ingegneri del software',
    publisher: {
      '@type': 'Organization',
      name: 'Gitbar',
    },
  }
}

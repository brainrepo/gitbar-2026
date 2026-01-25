export interface Episode {
  id: string
  number: number
  title: string
  description: string
  guest: {
    name: string
    role: string
    image: string
  }
  duration: string
  publishedAt: string
  audioUrl: string
  topics: string[]
  showNotes: string
}

export interface PodcastInfo {
  title: string
  description: string
  image: string
  author: string
  link: string
}

export interface PodcastData {
  info: PodcastInfo
  episodes: Episode[]
}

const RSS_URL = "https://api.riverside.fm/hosting/B4uOwdEh.rss"

function parseDuration(duration: string): string {
  // Handle HH:MM:SS or MM:SS format
  if (duration.includes(":")) {
    return duration
  }
  // Handle seconds
  const seconds = parseInt(duration, 10)
  if (isNaN(seconds)) return "0:00"
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`
}

function extractTopics(title: string, description: string): string[] {
  // Extract potential topics from title and description
  const commonTopics = [
    "Technology", "Business", "Creativity", "Leadership", "Innovation",
    "Design", "Marketing", "Startups", "AI", "Productivity", "Growth",
    "Culture", "Education", "Health", "Science", "Arts", "Music",
    "Entrepreneurship", "Finance", "Career", "Mindset", "Interview"
  ]
  
  const text = `${title} ${description}`.toLowerCase()
  const found = commonTopics.filter(topic => text.includes(topic.toLowerCase()))
  
  if (found.length === 0) {
    return ["Podcast", "Interview"]
  }
  
  return found.slice(0, 3)
}

function generateSlug(title: string, index: number): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 50) || `episode-${index + 1}`
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

export async function fetchPodcastData(): Promise<PodcastData> {
  const response = await fetch(RSS_URL, { 
    next: { revalidate: 3600 } // Cache for 1 hour
  })
  
  if (!response.ok) {
    throw new Error("Failed to fetch RSS feed")
  }
  
  const xml = await response.text()
  
  // Parse XML manually since we're in a browser-compatible environment
  const getTagContent = (xml: string, tag: string): string => {
    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i")
    const match = xml.match(regex)
    return match ? match[1].trim() : ""
  }
  
  const getCDATA = (content: string): string => {
    const cdataMatch = content.match(/<!\[CDATA\[([\s\S]*?)\]\]>/)
    return cdataMatch ? cdataMatch[1] : content
  }
  
  const getAttr = (xml: string, tag: string, attr: string): string => {
    const regex = new RegExp(`<${tag}[^>]*${attr}=["']([^"']*)["']`, "i")
    const match = xml.match(regex)
    return match ? match[1] : ""
  }
  
  // Extract channel info
  const channelMatch = xml.match(/<channel>([\s\S]*?)<\/channel>/i)
  const channelXml = channelMatch ? channelMatch[1] : xml
  
  const info: PodcastInfo = {
    title: stripHtml(getCDATA(getTagContent(channelXml, "title"))),
    description: stripHtml(getCDATA(getTagContent(channelXml, "description"))),
    image: getAttr(channelXml, "itunes:image", "href") || getTagContent(getTagContent(channelXml, "image"), "url"),
    author: getCDATA(getTagContent(channelXml, "itunes:author")) || "Unknown",
    link: getTagContent(channelXml, "link")
  }
  
  // Extract episodes
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  const items: string[] = []
  let match
  while ((match = itemRegex.exec(xml)) !== null) {
    items.push(match[1])
  }
  
  const episodes: Episode[] = items.map((item, index) => {
    const title = stripHtml(getCDATA(getTagContent(item, "title")))
    const description = stripHtml(getCDATA(getTagContent(item, "description")))
    const pubDate = getTagContent(item, "pubDate")
    const duration = getTagContent(item, "itunes:duration") || "0:00"
    const audioUrl = getAttr(item, "enclosure", "url")
    const episodeImage = getAttr(item, "itunes:image", "href") || info.image

    // Extract episode number from title (format: "Ep.123 - Title")
    const episodeMatch = title.match(/^Ep\.(\d+)\s*-/)
    const episodeNum = episodeMatch ? parseInt(episodeMatch[1], 10) : items.length - index

    return {
      id: generateSlug(title, index),
      number: episodeNum,
      title,
      description: description.substring(0, 300) + (description.length > 300 ? "..." : ""),
      guest: {
        name: info.author,
        role: "Host",
        image: episodeImage
      },
      duration: parseDuration(duration),
      publishedAt: pubDate ? new Date(pubDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      audioUrl,
      topics: extractTopics(title, description),
      showNotes: description
    }
  })
  
  // Sort episodes by publish date (newest first)
  const sortedEpisodes = episodes.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
  
  return { info, episodes: sortedEpisodes }
}

export function getEpisodeById(episodes: Episode[], id: string): Episode | undefined {
  return episodes.find(ep => ep.id === id)
}

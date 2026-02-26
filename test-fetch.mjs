// Simple test to fetch RSS and check episode 221
const RSS_URL = "https://api.riverside.fm/hosting/B4uOwdEh.rss"

function generateSlug(title, index) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 50) || `episode-${index + 1}`
}

async function test() {
  const response = await fetch(RSS_URL)
  const xml = await response.text()

  // Extract episodes
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  const items = []
  let match
  while ((match = itemRegex.exec(xml)) !== null) {
    items.push(match[1])
  }

  console.log(`Total episodes found: ${items.length}\n`)

  // Find episode 221
  items.forEach((item, index) => {
    const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/i)
    const title = titleMatch ? titleMatch[1] : ''

    if (title.includes('221')) {
      const slug = generateSlug(title, index)
      console.log('Episode 221 found!')
      console.log(`  Title: ${title}`)
      console.log(`  Index: ${index}`)
      console.log(`  Slug: ${slug}`)
      console.log(`  URL: http://localhost:3001/episode/${slug}`)
    }
  })
}

test().catch(console.error)

// Test script to check RSS feed parsing
import { fetchPodcastData } from './lib/rss-parser.ts'

async function test() {
  try {
    console.log('Fetching podcast data...')
    const data = await fetchPodcastData()

    console.log(`\nTotal episodes: ${data.episodes.length}`)
    console.log('\nFirst 3 episodes:')
    data.episodes.slice(0, 3).forEach(ep => {
      console.log(`  ${ep.number}: ${ep.title}`)
      console.log(`    ID: ${ep.id}`)
    })

    console.log('\nSearching for episode 221...')
    const ep221 = data.episodes.find(ep => ep.number === 221)
    if (ep221) {
      console.log('Episode 221 found!')
      console.log(`  Title: ${ep221.title}`)
      console.log(`  ID/Slug: ${ep221.id}`)
      console.log(`  URL: http://localhost:3001/episode/${ep221.id}`)
    } else {
      console.log('Episode 221 NOT FOUND!')
      console.log('Available episode numbers:', data.episodes.map(e => e.number).slice(0, 10))
    }
  } catch (error) {
    console.error('Error:', error.message)
    console.error(error.stack)
  }
}

test()

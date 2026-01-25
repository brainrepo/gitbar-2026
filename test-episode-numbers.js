// Test script to check episode numbers
const fetch = require('node-fetch');

async function test() {
  const RSS_URL = "https://api.riverside.fm/hosting/B4uOwdEh.rss";
  const response = await fetch(RSS_URL);
  const xml = await response.text();

  const getTagContent = (xml, tag) => {
    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
    const match = xml.match(regex);
    return match ? match[1].trim() : "";
  };

  const getCDATA = (content) => {
    const cdataMatch = content.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
    return cdataMatch ? cdataMatch[1] : content;
  };

  const stripHtml = (html) => {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .trim();
  };

  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  const items = [];
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    items.push(match[1]);
  }

  console.log(`Total episodes: ${items.length}\n`);

  // Show first 5 and last 5
  items.slice(0, 5).forEach((item, index) => {
    const title = stripHtml(getCDATA(getTagContent(item, "title")));
    const episodeNum = getTagContent(item, "itunes:episode");
    const season = getTagContent(item, "itunes:season");
    const calculatedNum = items.length - index;

    console.log(`Index ${index}:`);
    console.log(`  Title: ${title.substring(0, 60)}...`);
    console.log(`  itunes:episode: ${episodeNum || 'NONE'}`);
    console.log(`  itunes:season: ${season || 'NONE'}`);
    console.log(`  Calculated number: ${calculatedNum}`);
    console.log('');
  });

  console.log('...\n');

  items.slice(-5).forEach((item, index) => {
    const actualIndex = items.length - 5 + index;
    const title = stripHtml(getCDATA(getTagContent(item, "title")));
    const episodeNum = getTagContent(item, "itunes:episode");
    const season = getTagContent(item, "itunes:season");
    const calculatedNum = items.length - actualIndex;

    console.log(`Index ${actualIndex}:`);
    console.log(`  Title: ${title.substring(0, 60)}...`);
    console.log(`  itunes:episode: ${episodeNum || 'NONE'}`);
    console.log(`  itunes:season: ${season || 'NONE'}`);
    console.log(`  Calculated number: ${calculatedNum}`);
    console.log('');
  });
}

test().catch(console.error);

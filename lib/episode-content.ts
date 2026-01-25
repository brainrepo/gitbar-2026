import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"

export interface EpisodeContent {
  youtubeUrl?: string
  content: string
}

export interface TranscriptSegment {
  timestamp: string
  speaker: string
  text: string
}

export interface Transcript {
  episodeNumber: number
  segments: TranscriptSegment[]
}

const CONTENT_DIR = path.join(process.cwd(), "content", "episodes")

/**
 * Legge il file Markdown di un episodio se esistente
 * @param episodeNumber - Il numero dell'episodio
 * @returns Le informazioni aggiuntive dell'episodio o null se il file non esiste
 */
export async function getEpisodeContent(episodeNumber: number): Promise<EpisodeContent | null> {
  try {
    const filePath = path.join(CONTENT_DIR, `${episodeNumber}.md`)
    const fileContent = await fs.readFile(filePath, "utf-8")

    // Parsing del frontmatter e del contenuto
    const { data, content } = matter(fileContent)

    return {
      youtubeUrl: data.youtubeUrl,
      content: content.trim()
    }
  } catch (error) {
    // File non trovato o errore di lettura
    return null
  }
}

/**
 * Parse a .txt transcript file in the format:
 * Speaker Name (timestamp)
 * Text content
 *
 * Falls back to a single speaker format if no speaker patterns are found
 */
function parseTxtTranscript(content: string, episodeNumber: number): Transcript {
  const lines = content.split('\n')
  const segments: TranscriptSegment[] = []

  let currentSpeaker = ''
  let currentTimestamp = ''
  let currentText: string[] = []

  for (const line of lines) {
    // Check if line matches "Speaker Name (timestamp)" pattern
    const speakerMatch = line.match(/^(.+?)\s+\((\d{1,2}:\d{2}(?::\d{2})?)\)/)

    if (speakerMatch) {
      // Save previous segment if exists
      if (currentSpeaker && currentText.length > 0) {
        segments.push({
          timestamp: currentTimestamp,
          speaker: currentSpeaker,
          text: currentText.join(' ').trim()
        })
      }

      // Start new segment
      currentSpeaker = speakerMatch[1].trim()
      currentTimestamp = speakerMatch[2]
      currentText = []
    } else if (line.trim() !== '') {
      // Add to current segment text
      currentText.push(line.trim())
    }
  }

  // Save last segment
  if (currentSpeaker && currentText.length > 0) {
    segments.push({
      timestamp: currentTimestamp,
      speaker: currentSpeaker,
      text: currentText.join(' ').trim()
    })
  }

  // Fallback: If no segments were found (no speaker pattern detected),
  // treat the entire content as a single monologue segment
  if (segments.length === 0 && content.trim()) {
    segments.push({
      timestamp: "00:00",
      speaker: "Host",
      text: content.trim()
    })
  }

  return { episodeNumber, segments }
}

/**
 * Legge il file della trascrizione di un episodio se esistente (.json o .txt)
 * @param episodeNumber - Il numero dell'episodio
 * @returns La trascrizione dell'episodio o null se il file non esiste
 */
export async function getEpisodeTranscript(episodeNumber: number): Promise<Transcript | null> {
  // Try .txt first (newer format)
  try {
    const txtPath = path.join(CONTENT_DIR, `${episodeNumber}-transcript.txt`)
    const fileContent = await fs.readFile(txtPath, "utf-8")
    return parseTxtTranscript(fileContent, episodeNumber)
  } catch (error) {
    // Try .json format (legacy)
    try {
      const jsonPath = path.join(CONTENT_DIR, `${episodeNumber}-transcript.json`)
      const fileContent = await fs.readFile(jsonPath, "utf-8")
      return JSON.parse(fileContent) as Transcript
    } catch (error) {
      // Neither file found
      return null
    }
  }
}

/**
 * Verifica se esistono contenuti aggiuntivi per un episodio
 * @param episodeNumber - Il numero dell'episodio
 * @returns True se esiste almeno un file di contenuto aggiuntivo
 */
export async function hasEpisodeContent(episodeNumber: number): Promise<boolean> {
  try {
    const mdPath = path.join(CONTENT_DIR, `${episodeNumber}.md`)
    const jsonPath = path.join(CONTENT_DIR, `${episodeNumber}-transcript.json`)
    const txtPath = path.join(CONTENT_DIR, `${episodeNumber}-transcript.txt`)

    const [mdExists, jsonExists, txtExists] = await Promise.all([
      fs.access(mdPath).then(() => true).catch(() => false),
      fs.access(jsonPath).then(() => true).catch(() => false),
      fs.access(txtPath).then(() => true).catch(() => false)
    ])

    return mdExists || jsonExists || txtExists
  } catch (error) {
    return false
  }
}

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

export const episodes: Episode[] = [
  {
    id: "finding-stillness",
    number: 12,
    title: "Finding Stillness in a Noisy World",
    description: "Maya explores the art of intentional living and how slowing down can lead to greater creativity and fulfillment in our always-connected age.",
    guest: {
      name: "Maya Chen",
      role: "Author & Mindfulness Coach",
      image: "/images/guest-1.jpg"
    },
    duration: "58:24",
    publishedAt: "2026-01-20",
    audioUrl: "/audio/ep-12.mp3",
    topics: ["Mindfulness", "Creativity", "Intentional Living"],
    showNotes: `In this episode, we dive deep into the practice of intentional living with Maya Chen, bestselling author of "The Art of Stillness."

**Key Takeaways:**
- How to create meaningful pauses in your daily routine
- The connection between silence and creative breakthroughs
- Practical exercises for cultivating presence
- Why our brains need more "white space"

**Timestamps:**
- 00:00 Introduction
- 05:30 Maya's journey to mindfulness
- 18:45 The science of stillness
- 32:00 Practical exercises
- 45:20 Q&A segment
- 55:00 Closing thoughts

**Resources Mentioned:**
- "The Art of Stillness" by Maya Chen
- Headspace app
- The Minimalists podcast`
  },
  {
    id: "building-in-public",
    number: 11,
    title: "Building in Public: The New Way to Launch",
    description: "James shares his unconventional approach to building companies by sharing the journey openly, attracting customers and investors through transparency.",
    guest: {
      name: "James Wright",
      role: "Founder, OpenBuild",
      image: "/images/guest-2.jpg"
    },
    duration: "1:02:15",
    publishedAt: "2026-01-13",
    audioUrl: "/audio/ep-11.mp3",
    topics: ["Startups", "Transparency", "Community Building"],
    showNotes: `James Wright joins us to discuss the power of building in public and how transparency can be your greatest competitive advantage.

**Key Takeaways:**
- Why sharing your failures matters as much as successes
- Building community before product
- The psychology of public accountability
- Metrics that matter when building in public

**Timestamps:**
- 00:00 Introduction
- 08:20 James's startup journey
- 22:15 The first viral tweet
- 38:40 Handling criticism publicly
- 52:00 Revenue transparency
- 58:30 Advice for founders

**Resources Mentioned:**
- OpenBuild community forum
- "Working in Public" by Nadia Eghbal`
  },
  {
    id: "second-act",
    number: 10,
    title: "The Second Act: Reinventing Yourself at 50",
    description: "Patricia left her corner office to pursue her passion. She shares the fears, failures, and ultimate freedom of starting over.",
    guest: {
      name: "Patricia Moore",
      role: "Former CFO, Now Ceramicist",
      image: "/images/guest-3.jpg"
    },
    duration: "52:38",
    publishedAt: "2026-01-06",
    audioUrl: "/audio/ep-10.mp3",
    topics: ["Career Change", "Creativity", "Life Transitions"],
    showNotes: `Patricia Moore traded spreadsheets for clay and discovered that her "second act" was actually her first authentic one.

**Key Takeaways:**
- Signs it's time for a change
- Financial planning for career transitions
- Finding your authentic path
- The myth of "too late"

**Timestamps:**
- 00:00 Introduction
- 06:15 Life as a CFO
- 19:30 The breaking point
- 28:45 First pottery class
- 40:00 Building a new identity
- 48:20 Advice for others

**Resources Mentioned:**
- Patricia's pottery studio: Clay & Soul
- "Designing Your Life" by Bill Burnett`
  },
  {
    id: "digital-minimalism",
    number: 9,
    title: "Digital Minimalism: Reclaiming Your Attention",
    description: "Alex discusses how intentional technology use can transform your productivity, relationships, and overall well-being.",
    guest: {
      name: "Alex Rivera",
      role: "Designer & Digital Wellness Advocate",
      image: "/images/guest-4.jpg"
    },
    duration: "47:52",
    publishedAt: "2025-12-30",
    audioUrl: "/audio/ep-9.mp3",
    topics: ["Digital Wellness", "Productivity", "Minimalism"],
    showNotes: `Alex Rivera helps us understand why less screen time might actually make us more connected, not less.

**Key Takeaways:**
- The attention economy and your brain
- Practical steps for a digital declutter
- Designing technology that respects users
- Creating healthy boundaries

**Timestamps:**
- 00:00 Introduction
- 04:45 Alex's digital awakening
- 16:20 The 30-day digital declutter
- 28:30 Essential vs. optional tech
- 38:15 The future of ethical design
- 44:00 Final thoughts

**Resources Mentioned:**
- "Digital Minimalism" by Cal Newport
- Screen Time app features
- Alex's design portfolio`
  }
]

export function getEpisode(id: string): Episode | undefined {
  return episodes.find(ep => ep.id === id)
}

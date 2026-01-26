import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Gitbar Podcast - Il dopolavoro digitale degli sviluppatori',
    short_name: 'Gitbar',
    description: 'Il circolo del dopolavoro degli sviluppatori e ingegneri del software. Chiacchiere su JavaScript, Rust, AI, DevOps, architetture e soft skills.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-light-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}

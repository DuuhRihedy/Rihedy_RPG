import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hub RPG',
    short_name: 'Hub RPG',
    description: 'Gerenciador inteligente para campanhas de RPG com IA (D&D 3.5 / 5e)',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0b',
    theme_color: '#d4af37',
    icons: [
      {
        src: '/icon.svg',
        sizes: '192x192 512x512',
        type: 'image/svg+xml',
        purpose: 'maskable'
      }
    ],
  }
}

import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hack-o-Veda 2026 | SMVITM',
    short_name: 'Hack-o-Veda',
    description: 'Official Innovation & Hackathon Portal of Shri Madhwa Vadiraja Institute of Technology & Management.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fffcf0',
    theme_color: '#fffcf0',
    icons: [
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}

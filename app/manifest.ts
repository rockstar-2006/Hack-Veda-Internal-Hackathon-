import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hackveda 2026 | SMVITM',
    short_name: 'Hackveda',
    description: 'Official Innovation & Hackathon Portal of Shri Madhwa Vadiraja Institute of Technology & Management.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4f46e5',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}

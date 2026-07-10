import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.fullName,
    short_name: siteConfig.name,
    description:
      'The Lagos Young Entrepreneurs Awards honour the founders under fifty reshaping Lagos.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0E0B09',
    theme_color: '#0E0B09',
    icons: [
      { src: '/laye-emblem.png', sizes: 'any', type: 'image/png', purpose: 'any' },
      { src: '/laye-emblem.png', sizes: '192x192', type: 'image/png' },
      { src: '/laye-emblem.png', sizes: '512x512', type: 'image/png' },
    ],
    categories: ['business', 'events'],
    lang: 'en-NG',
  }
}

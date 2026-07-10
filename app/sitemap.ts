import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'
import { getAllNominees } from '@/lib/content/nominees'

const staticRoutes: {
  path: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
}[] = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/categories', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/nominees', priority: 0.9, changeFrequency: 'daily' },
  { path: '/sponsorship', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/gallery', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/apply', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/login', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/register', priority: 0.4, changeFrequency: 'yearly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()

  const main = staticRoutes.map(route => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  const nominees = await getAllNominees()
  const nomineePages = nominees.map(nominee => ({
    url: `${siteConfig.url}/nominees/${nominee.slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...main, ...nomineePages]
}

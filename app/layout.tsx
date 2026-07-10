import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { Suspense } from 'react'
import { siteConfig } from '@/config/site'
import { SmoothScroll } from '@/components/providers/SmoothScroll'
import { Preloader } from '@/components/layout/Preloader'
import { CustomCursor } from '@/components/layout/CustomCursor'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { RouteProgress } from '@/components/layout/RouteProgress'
import './globals.css'

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name}, ${siteConfig.fullName}`,
    template: `%s · ${siteConfig.name}`,
  },
  description:
    'The Lagos Young Entrepreneurs Awards honour the founders under fifty reshaping Lagos across forty-three categories of enterprise. Apply, nominate, and vote.',
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.organiser }],
  creator: siteConfig.organiser,
  publisher: siteConfig.organiser,
  keywords: [
    'LAYEAWARDS',
    'Lagos Young Entrepreneur Awards',
    'Lagos Young Entrepreneurs Awards',
    'young entrepreneurs Lagos',
    'Nigerian business awards',
    'entrepreneurship awards',
    'Lagos awards',
    'African entrepreneur awards',
  ],
  category: 'Business Awards',
  alternates: { canonical: '/' },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: `${siteConfig.name}, ${siteConfig.fullName}`,
    description:
      'Celebrating the young enterprise reshaping Lagos. Apply, nominate, and vote in the LAYEAWARDS.',
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: 'website',
    locale: 'en_NG',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: `${siteConfig.fullName}, celebrating young enterprise in Lagos`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name}, ${siteConfig.fullName}`,
    description: 'Celebrating the young enterprise reshaping Lagos.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: '/laye-emblem.png',
    apple: '/laye-emblem.png',
  },
}

export const viewport = {
  themeColor: '#0E0B09',
  colorScheme: 'dark' as const,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false as const,
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteConfig.url}#organization`,
  name: siteConfig.fullName,
  alternateName: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/laye-logo.png`,
  email: siteConfig.contact.email,
  telephone: siteConfig.contact.phones[0],
  sameAs: [siteConfig.socials.instagram, siteConfig.socials.facebook],
  founder: {
    '@type': 'Person',
    name: siteConfig.leadership.name,
    jobTitle: siteConfig.leadership.title,
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lagos',
    addressRegion: 'Lagos State',
    addressCountry: 'NG',
  },
}

const eventSchema = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: `${siteConfig.fullName}, ${siteConfig.edition.ordinal} Edition`,
  description:
    'Annual awards ceremony recognising the young entrepreneurs reshaping Lagos across forty-three categories of enterprise.',
  startDate: siteConfig.edition.ceremonyDate ?? `${siteConfig.edition.year}-12-01`,
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  eventStatus: 'https://schema.org/EventScheduled',
  location: {
    '@type': 'Place',
    name: siteConfig.edition.city,
    address: { '@type': 'PostalAddress', addressLocality: 'Lagos', addressCountry: 'NG' },
  },
  organizer: { '@type': 'Organization', name: siteConfig.fullName, url: siteConfig.url },
  url: siteConfig.url,
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteConfig.url}#website`,
  url: siteConfig.url,
  name: siteConfig.name,
  alternateName: siteConfig.fullName,
  publisher: { '@id': `${siteConfig.url}#organization` },
  inLanguage: 'en-NG',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
        />
      </head>
      <body className="grain min-h-dvh bg-canvas antialiased">
        <Suspense fallback={null}>
          <RouteProgress />
        </Suspense>
        <SmoothScroll>
          <Preloader />
          <CustomCursor />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  )
}

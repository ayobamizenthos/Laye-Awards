import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Moments from the LAYEAWARDS ceremonies, the red carpet, the stage, and the night Lagos celebrates its own.',
  alternates: { canonical: '/gallery' },
  openGraph: {
    title: `Gallery · ${siteConfig.name}`,
    description: 'Moments from the LAYEAWARDS ceremonies.',
    url: `${siteConfig.url}/gallery`,
  },
}

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Moments of Excellence"
        heading={
          <>
            The night, as it <em className="italic text-gilded">unfolded</em>.
          </>
        }
        lead="Scenes from the ceremonies: the carpet, the stage, the room when a name is called."
      />
      <div className="theme-light">
        <GalleryGrid />
      </div>
    </>
  )
}

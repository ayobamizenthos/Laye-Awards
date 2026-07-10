import type { Metadata } from 'next'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { press } from '@/lib/content/content'
import { PageHeader } from '@/components/ui/PageHeader'
import { Container } from '@/components/ui/Section'
import { StaggerReveal, StaggerItem } from '@/components/motion/StaggerReveal'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Featured stories, editorial coverage and announcements from the Lagos Young Entrepreneur Awards.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: `Blog · ${siteConfig.name}`,
    description: 'Featured stories and editorial coverage of LAYEAWARDS.',
    url: `${siteConfig.url}/blog`,
  },
}

export default function BlogPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Blog"
        heading={
          <>
            Stories, dispatches and <em className="italic text-gilded">press</em>.
          </>
        }
        lead="Editorial coverage from the publications watching what young Lagos enterprise is building."
      />

      <div className="theme-light">
        <Container className="py-12 sm:py-16 lg:py-24">
          <StaggerReveal
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
            stagger={0.08}
            y={36}
          >
            {press.map(item => (
              <StaggerItem key={item.id} className="h-full">
                <a
                  href={item.articleUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor-hover
                  className="group/post relative flex h-full flex-col overflow-hidden rounded-2xl border border-gold/20 bg-surface transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-gold/55 hover:shadow-[0_28px_60px_-30px_rgba(151,116,42,0.45)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-raised">
                    <Image
                      src={item.logoUrl}
                      alt={`${item.publication} logo`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-8 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/post:scale-[1.04] sm:p-10 lg:p-12"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold-deep sm:text-[0.7rem]">
                        {item.publication}
                      </span>
                      <span className="size-1 rounded-full bg-gold/50" />
                      <span className="text-[0.62rem] uppercase tracking-[0.14em] text-ink-faint sm:text-xs">
                        {item.publishedDate}
                      </span>
                    </div>
                    <h2 className="mt-3 font-display text-lg leading-snug text-ink transition-colors duration-300 group-hover/post:text-gold-deep sm:text-xl lg:text-2xl">
                      {item.headline}
                    </h2>
                    {item.excerpt && (
                      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-soft">
                        {item.excerpt}
                      </p>
                    )}
                    <span className="mt-5 inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-ink-soft transition-colors duration-300 group-hover/post:text-gold sm:text-[0.7rem]">
                      Read article
                      <ArrowUpRight
                        className="size-3.5 transition-transform duration-300 group-hover/post:translate-x-0.5 group-hover/post:-translate-y-0.5"
                        strokeWidth={1.75}
                      />
                    </span>
                  </div>
                </a>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </Container>
      </div>
    </>
  )
}

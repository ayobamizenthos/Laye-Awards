import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, MapPin, Crown } from 'lucide-react'
import { editions, getEditionBySlug, type Sponsor } from '@/lib/content/content'
import editionPhotos from '@/lib/content/editionPhotos.json'
import { siteConfig } from '@/config/site'
import { Section, Container } from '@/components/ui/Section'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Reveal } from '@/components/motion/Reveal'
import { StaggerReveal, StaggerItem } from '@/components/motion/StaggerReveal'
import { EditionGallery } from '@/components/gallery/EditionGallery'

export function generateStaticParams() {
  return editions.map(edition => ({ slug: edition.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const edition = getEditionBySlug(slug)
  if (!edition) return {}
  return {
    title: edition.ordinal,
    description: `${edition.ordinal} of the ${siteConfig.fullName}, held at ${edition.location}.`,
    alternates: { canonical: `/editions/${edition.slug}` },
  }
}

export default async function EditionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const edition = getEditionBySlug(slug)
  if (!edition) notFound()

  const index = editions.findIndex(item => item.slug === slug)
  const previous = editions[index - 1]
  const next = editions[index + 1]
  const number = String(edition.number).padStart(2, '0')
  const patrons = edition.sponsors.filter(sponsor => sponsor.prominent)
  const partners = edition.sponsors.filter(sponsor => !sponsor.prominent)
  const photos = (editionPhotos as Record<string, string[]>)[String(edition.number)] ?? []

  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-36 lg:pt-44 lg:pb-24">
        <Image
          src={edition.imageUrl}
          alt={edition.ordinal}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/85 to-onyx/55" />
        <Container className="relative">
          <Link
            href="/gallery"
            data-cursor-hover
            className="inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-gold-light transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-4" strokeWidth={1.75} />
            All editions
          </Link>

          <p className="mt-8 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-gold-light">
            Edition {number}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-hero font-medium leading-[0.98] text-ink [text-shadow:0_2px_40px_rgba(12,10,7,0.6)]">
            {edition.ordinal}
          </h1>
          <p className="mt-5 max-w-xl text-balance text-base leading-relaxed text-ink-soft sm:text-lg">
            {edition.theme}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-onyx/40 px-4 py-2 text-xs font-medium text-ink backdrop-blur-sm">
              <MapPin className="size-4 text-gold-light" strokeWidth={1.75} />
              {edition.location}
            </span>
          </div>
        </Container>
      </section>

      <div className="theme-light">
        {photos.length > 0 && (
          <Section spacing="lg">
            <Container>
              <SectionIntro
                eyebrow="The Gallery"
                heading={
                  <>
                    Inside the <em className="italic text-gilded">night</em>.
                  </>
                }
                lead={`Moments from the ${edition.ordinal.toLowerCase()} at ${edition.location}.`}
              />
              <div className="mt-12 lg:mt-16">
                <EditionGallery photos={photos} label={edition.ordinal} />
              </div>
            </Container>
          </Section>
        )}

        {edition.sponsors.length > 0 && (
          <Section spacing="lg" className="bg-surface">
            <Container>
              <SectionIntro
                eyebrow="Sponsors & Partners"
                heading={
                  <>
                    The names that <em className="italic text-gilded">backed</em> the night.
                  </>
                }
                lead={`The ${edition.ordinal.toLowerCase()} was made possible by the patrons and partners who stood behind it.`}
              />

              {patrons.length > 0 && (
                <div className="mx-auto mt-12 max-w-3xl space-y-5 lg:mt-16">
                  {patrons.map(patron => (
                    <PatronCard key={patron.name} sponsor={patron} />
                  ))}
                </div>
              )}

              {partners.length > 0 && (
                <StaggerReveal
                  className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
                  stagger={0.05}
                  y={24}
                >
                  {partners.map(partner => (
                    <StaggerItem key={partner.name} className="h-full">
                      <PartnerCard sponsor={partner} />
                    </StaggerItem>
                  ))}
                </StaggerReveal>
              )}
            </Container>
          </Section>
        )}

        <Section spacing="sm">
          <Container>
            <div className="flex items-center justify-between gap-4 border-t border-gold/20 pt-8">
              {previous ? (
                <Link
                  href={`/editions/${previous.slug}`}
                  data-cursor-hover
                  className="group/nav inline-flex items-center gap-2 text-sm font-medium text-ink-soft transition-colors hover:text-gold-deep"
                >
                  <ArrowLeft
                    className="size-4 transition-transform duration-300 group-hover/nav:-translate-x-0.5"
                    strokeWidth={1.75}
                  />
                  {previous.ordinal}
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  href={`/editions/${next.slug}`}
                  data-cursor-hover
                  className="group/nav inline-flex items-center gap-2 text-right text-sm font-medium text-ink-soft transition-colors hover:text-gold-deep"
                >
                  {next.ordinal}
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover/nav:translate-x-0.5"
                    strokeWidth={1.75}
                  />
                </Link>
              ) : (
                <span />
              )}
            </div>
          </Container>
        </Section>
      </div>
    </>
  )
}

function PatronCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <div className="flex flex-col items-center gap-6 rounded-3xl border border-gold/45 bg-gradient-to-br from-gold/[0.16] via-gold/[0.05] to-transparent p-7 text-center shadow-[0_26px_64px_-42px_rgba(151,116,42,0.55)] sm:flex-row sm:gap-7 sm:p-8 sm:text-left">
      {sponsor.logoUrl ? (
        <span className="relative size-28 shrink-0 overflow-hidden rounded-full border-2 border-gold/60 shadow-[0_16px_40px_-18px_rgba(151,116,42,0.7)] sm:size-32">
          <Image
            src={sponsor.logoUrl}
            alt={sponsor.name}
            fill
            sizes="128px"
            className="object-cover object-top"
          />
        </span>
      ) : (
        <span className="flex size-20 shrink-0 items-center justify-center rounded-full border border-gold/45 bg-gold/[0.08] text-gold-deep sm:size-24">
          <Crown className="size-8" strokeWidth={1.5} />
        </span>
      )}
      <div className="flex-1">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold-deep sm:text-[0.7rem]">
          Distinguished Patron
        </p>
        <p className="mt-2 font-display text-2xl leading-tight text-ink sm:text-3xl">
          {sponsor.name}
        </p>
        {sponsor.title && (
          <p className="mt-1.5 text-sm font-medium text-ink-soft sm:text-base">{sponsor.title}</p>
        )}
      </div>
      {sponsor.crestUrl && (
        <span className="relative size-16 shrink-0 sm:size-20">
          <Image src={sponsor.crestUrl} alt="" fill sizes="80px" className="object-contain" />
        </span>
      )}
    </div>
  )
}

function PartnerCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <div className="flex h-full min-h-36 flex-col items-center justify-center gap-2.5 rounded-2xl border border-gold/20 bg-white p-4 text-center shadow-[0_14px_34px_-28px_rgba(151,116,42,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/55 hover:shadow-[0_22px_48px_-30px_rgba(151,116,42,0.55)] sm:min-h-44 sm:p-5">
      {sponsor.logoUrl ? (
        <>
          <span className="relative h-24 w-full sm:h-28">
            <Image
              src={sponsor.logoUrl}
              alt={sponsor.name}
              fill
              sizes="(max-width: 640px) 46vw, 260px"
              className="object-contain"
            />
          </span>
          {sponsor.showName && (
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-ink-soft">
              {sponsor.name}
            </span>
          )}
        </>
      ) : (
        <span className="flex flex-col items-center gap-2">
          <span className="h-px w-8 bg-gold/60" />
          <span className="font-display text-base font-semibold uppercase leading-tight tracking-[0.06em] text-ink sm:text-lg">
            {sponsor.name}
          </span>
          <span className="h-px w-8 bg-gold/60" />
        </span>
      )}
    </div>
  )
}

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getNomineeBySlug, getNomineesByCategory } from '@/lib/content/nominees'
import { getCategoryBySlug } from '@/lib/content/categories'
import { createSupabasePublicClient } from '@/lib/supabase/server'
import { Container } from '@/components/ui/Section'
import { CategoryBadge } from '@/components/ui/CategoryBadge'
import { Reveal } from '@/components/motion/Reveal'
import { RevealHeading } from '@/components/motion/RevealHeading'
import { StaggerReveal, StaggerItem } from '@/components/motion/StaggerReveal'
import { NomineeCard } from '@/components/nominees/NomineeCard'
import { VotingWidget } from '@/components/nominees/VotingWidget'
import { ShareRow } from '@/components/nominees/ShareRow'
import { siteConfig } from '@/config/site'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const nominee = await getNomineeBySlug(slug)
  if (!nominee) return { title: 'Nominee Not Found' }
  const description = `${nominee.fullName} of ${nominee.businessName}, ${nominee.headline}`
  const url = `${siteConfig.url}/nominees/${nominee.slug}`
  return {
    title: nominee.fullName,
    description,
    alternates: { canonical: `/nominees/${nominee.slug}` },
    openGraph: {
      title: `${nominee.fullName} · ${siteConfig.name}`,
      description,
      url,
      type: 'profile',
      images: [
        {
          url: nominee.headshotUrl,
          alt: nominee.fullName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: nominee.fullName,
      description,
      images: [nominee.headshotUrl],
    },
  }
}

export default async function NomineePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const nominee = await getNomineeBySlug(slug)
  if (!nominee) notFound()

  const category = getCategoryBySlug(nominee.categorySlug)
  const sameCategory = await getNomineesByCategory(nominee.categorySlug)
  const related = sameCategory.filter(other => other.id !== nominee.id).slice(0, 3)

  const settingsClient = createSupabasePublicClient()
  const { data: settings } = await settingsClient
    .from('voting_settings')
    .select('is_open, price_per_vote_kobo')
    .eq('id', 1)
    .maybeSingle()

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: nominee.fullName,
    description: nominee.bio,
    image: nominee.headshotUrl,
    jobTitle: nominee.headline,
    worksFor: {
      '@type': 'Organization',
      name: nominee.businessName,
    },
    url: `${siteConfig.url}/nominees/${nominee.slug}`,
    award: `${siteConfig.name} nominee · ${category?.shortName ?? nominee.categorySlug}`,
  }

  return (
    <div className="pt-24 sm:pt-28 lg:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Container>
        <Reveal y={16}>
          <Link
            href="/nominees"
            data-cursor-hover
            className="inline-flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-ink-soft transition-colors duration-300 hover:text-gold-deep sm:text-[0.72rem]"
          >
            <ArrowLeft className="size-3.5 sm:size-4" strokeWidth={1.75} />
            All Nominees
          </Link>
        </Reveal>

        <div className="mt-6 grid gap-7 sm:mt-8 sm:gap-9 lg:mt-10 lg:grid-cols-12 lg:gap-12">
          <Reveal y={40} className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-hairline">
              <Image
                src={nominee.headshotUrl}
                alt={nominee.fullName}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
                {category && <CategoryBadge>{category.shortName}</CategoryBadge>}
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-28">
              <RevealHeading
                as="h1"
                className="font-display text-3xl font-medium leading-tight text-ink sm:text-4xl lg:text-5xl"
              >
                {nominee.fullName}
              </RevealHeading>

              <Reveal y={20} delay={0.05} className="mt-2 sm:mt-3">
                <p className="text-sm text-ink-soft sm:text-base">
                  {nominee.businessName} · {nominee.industry}
                </p>
                <p className="mt-3 font-display text-lg italic leading-snug text-ink sm:mt-4 sm:text-xl lg:text-2xl">
                  {nominee.headline}
                </p>
              </Reveal>

              <Reveal y={28} delay={0.18} className="mt-6 sm:mt-7">
                <VotingWidget
                  nominee={nominee}
                  isOpen={settings?.is_open ?? false}
                  pricePerVoteKobo={settings?.price_per_vote_kobo ?? 10000}
                />
              </Reveal>

              <Reveal delay={0.24} className="mt-6 sm:mt-7">
                <ShareRow nominee={nominee} />
              </Reveal>
            </div>
          </div>
        </div>

        <div className="mt-14 max-w-3xl pt-8 sm:mt-16 sm:pt-10 lg:mt-20 lg:pt-12">
          <span className="eyebrow text-gold-deep">The Story</span>
          <Reveal y={28} className="mt-4 sm:mt-6">
            <p className="font-display text-xl leading-snug text-ink sm:text-2xl lg:text-3xl">
              {nominee.bio}
            </p>
          </Reveal>
        </div>
      </Container>

      {related.length > 0 && (
        <Container className="mt-14 border-t border-hairline pt-12 sm:mt-16 sm:pt-14 lg:mt-20 lg:pt-16">
          <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl lg:text-4xl">
            More in {category?.shortName}
          </h2>
          <StaggerReveal
            className="mt-7 grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-3 lg:mt-10 lg:gap-6"
            stagger={0.09}
          >
            {related.map(other => (
              <StaggerItem key={other.id} className="h-full">
                <NomineeCard nominee={other} />
              </StaggerItem>
            ))}
          </StaggerReveal>
        </Container>
      )}

      <div className="h-16 sm:h-20 lg:h-24" />
    </div>
  )
}

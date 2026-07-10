import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section, Container } from '@/components/ui/Section'
import { Reveal } from '@/components/motion/Reveal'
import { ApplicationForm } from '@/components/apply/ApplicationForm'
import { getFullCategorySlugs } from '@/lib/content/nominees'

export const metadata: Metadata = {
  title: 'Apply',
  description:
    'Apply for the Lagos Young Entrepreneurs Awards across forty-three categories of enterprise. A few minutes is all it takes.',
  alternates: { canonical: '/apply' },
  openGraph: {
    title: `Apply · ${siteConfig.name}`,
    description: 'Put yourself forward for the Lagos Young Entrepreneurs Awards.',
    url: `${siteConfig.url}/apply`,
  },
}

export const dynamic = 'force-dynamic'

export default async function ApplyPage() {
  const fullCategorySlugs = await getFullCategorySlugs()
  return (
    <>
      <PageHeader
        eyebrow="Open for nominations"
        heading={
          <>
            Put yourself <em className="italic text-gilded">forward</em>.
          </>
        }
        lead="A few minutes is all it takes. Tell us about your enterprise, and the review panel does the rest."
      />

      <div className="theme-light">
        <Section spacing="lg">
          <Container>
            <div className="mx-auto max-w-4xl">
              <Reveal y={36}>
                <Suspense
                  fallback={
                    <div className="h-[480px] rounded-2xl border border-hairline bg-surface" />
                  }
                >
                  <ApplicationForm fullCategorySlugs={fullCategorySlugs} />
                </Suspense>
              </Reveal>
              <Reveal delay={0.1} className="mt-6 text-center text-sm text-ink-soft">
                Already have an account?{' '}
                <Link
                  href="/login"
                  data-cursor-hover
                  className="font-medium text-gold-deep underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </Reveal>
            </div>
          </Container>
        </Section>
      </div>
    </>
  )
}

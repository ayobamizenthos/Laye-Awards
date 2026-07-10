import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CalendarClock } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { getAllNominees } from '@/lib/content/nominees'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section, Container } from '@/components/ui/Section'
import { Reveal } from '@/components/motion/Reveal'
import { Button } from '@/components/ui/Button'
import { NomineeDirectory } from '@/components/nominees/NomineeDirectory'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Nominees & Voting',
  description: 'Voting is live. Browse every entrepreneur in the running and cast your vote.',
  alternates: { canonical: '/nominees' },
  openGraph: {
    title: `Nominees & Voting · ${siteConfig.name}`,
    description: 'Voting is live. Browse every entrepreneur in the running and cast your vote.',
    url: `${siteConfig.url}/nominees`,
  },
}

export default async function NomineesPage() {
  const nominees = await getAllNominees()
  const hasNominees = nominees.length > 0

  return (
    <>
      <PageHeader
        eyebrow="Nominees & Voting"
        heading={
          <>
            Vote for who <em className="italic text-gilded">deserves</em> it.
          </>
        }
        lead="Voting is live. Browse every entrepreneur in the running, find the ones you believe in, and cast your vote."
      />

      {hasNominees ? (
        <div className="theme-light">
          <Suspense fallback={null}>
            <NomineeDirectory nominees={nominees} />
          </Suspense>
        </div>
      ) : (
        <div className="theme-light">
          <Section spacing="lg">
            <Container>
              <Reveal y={36}>
                <div className="flex flex-col items-center rounded-2xl border border-gold/30 bg-gradient-to-b from-gold/[0.07] to-transparent px-6 py-16 text-center lg:py-20">
                  <span className="flex size-14 items-center justify-center rounded-full bg-gold/15 text-gold">
                    <CalendarClock className="size-7" strokeWidth={1.6} />
                  </span>
                  <p className="mt-7 eyebrow text-gold-deep">Voting is live</p>
                  <h2 className="mt-4 max-w-2xl font-display text-display font-medium text-ink">
                    Be the <span className="text-gilded">first</span> on the ballot.
                  </h2>
                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
                    Register your enterprise and your profile goes live here instantly, ready to
                    receive votes the moment you share your link.
                  </p>
                  <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                    <Button href="/apply" withArrow>
                      Register Now
                    </Button>
                    <Button href="/categories" variant="secondary">
                      See the Categories
                    </Button>
                  </div>
                </div>
              </Reveal>
            </Container>
          </Section>
        </div>
      )}
    </>
  )
}

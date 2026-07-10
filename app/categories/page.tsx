import type { Metadata } from 'next'
import { Check } from 'lucide-react'
import { categoryGroupA, categoryGroupB } from '@/lib/content/categories'
import { eligibilityCriteria } from '@/lib/content/content'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section, Container } from '@/components/ui/Section'
import { Reveal } from '@/components/motion/Reveal'
import { CategoryExplorer } from '@/components/categories/CategoryExplorer'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Award Categories',
  description:
    'The full LAYEAWARDS honours roll, forty-three competitive categories decided by public vote and three special honours conferred by the organisers.',
  alternates: { canonical: '/categories' },
  openGraph: {
    title: `Categories · ${siteConfig.name}`,
    description: 'Forty-six ways to be recognised at the Lagos Young Entrepreneurs Awards.',
    url: `${siteConfig.url}/categories`,
  },
}

export default function CategoriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Honours"
        heading={
          <>
            Forty-six ways to be <em className="italic text-gilded">recognised</em>.
          </>
        }
        lead="Tap any category to see what it celebrates, then apply in minutes. Forty-three awards decided by public vote, three special honours by the organisers."
      />

      <div className="theme-light">
        <CategoryExplorer groupA={categoryGroupA} groupB={categoryGroupB} />

        <Section spacing="lg">
          <Container>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-4">
                <span className="eyebrow text-gold-deep">Eligibility</span>
                <h2 className="mt-6 font-display text-display font-medium text-ink">
                  Who can <em className="italic text-gilded">stand</em>.
                </h2>
              </div>

              <ul className="space-y-3 lg:col-span-7 lg:col-start-6">
                {eligibilityCriteria.map((criterion, index) => (
                  <li key={index}>
                    <Reveal y={20} delay={index * 0.05}>
                      <div className="flex items-center gap-4 rounded-xl border border-gold/15 bg-surface px-5 py-4">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
                          <Check className="size-3.5" strokeWidth={2.5} />
                        </span>
                        <p className="text-base leading-relaxed text-ink">{criterion}</p>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </Section>
      </div>
    </>
  )
}

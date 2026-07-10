'use client'

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { Category } from '@/types'
import { categoryGroupA, categoryGroupB } from '@/lib/content/categories'
import { Section, Container } from '@/components/ui/Section'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Reveal } from '@/components/motion/Reveal'
import { StaggerReveal, StaggerItem } from '@/components/motion/StaggerReveal'
import { Button } from '@/components/ui/Button'
import { CategoryModal } from '@/components/categories/CategoryModal'

const featured = categoryGroupA.slice(0, 12)

export function Categories() {
  const [active, setActive] = useState<Category | null>(null)

  return (
    <Section id="categories">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntro
            eyebrow="The Honours"
            heading={
              <>
                Forty-six ways to be <em className="italic text-gilded">recognised</em>.
              </>
            }
            lead="Forty-three competitive awards across every sector of enterprise, and three special honours reserved for the few."
          />
          <Reveal delay={0.1} className="shrink-0">
            <Button href="/categories" withArrow>
              All 46 Categories
            </Button>
          </Reveal>
        </div>

        <StaggerReveal
          className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-4"
          stagger={0.04}
          y={22}
        >
          {featured.map((category, index) => (
            <StaggerItem key={category.id}>
              <button
                type="button"
                onClick={() => setActive(category)}
                data-cursor-hover
                className="group/cat flex w-full items-center gap-4 rounded-2xl border border-hairline bg-surface/50 px-5 py-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/55 hover:bg-surface"
              >
                <span className="font-sans text-xs font-semibold tabular-nums text-gold">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 font-display text-lg font-medium leading-tight text-ink transition-colors duration-300 group-hover/cat:text-gold-light">
                  {category.shortName}
                </span>
                <ArrowUpRight
                  className="size-4 shrink-0 text-ink-faint opacity-0 transition-all duration-300 group-hover/cat:translate-x-0.5 group-hover/cat:-translate-y-0.5 group-hover/cat:text-gold group-hover/cat:opacity-100"
                  strokeWidth={1.75}
                />
              </button>
            </StaggerItem>
          ))}
        </StaggerReveal>

        <Reveal delay={0.1} className="mt-5 text-center text-sm text-ink-faint lg:mt-6">
          + {categoryGroupA.length - featured.length} more competitive categories
        </Reveal>

        <div className="mt-16 lg:mt-24">
          <div className="flex items-center gap-4">
            <span className="eyebrow whitespace-nowrap text-gold-deep">
              Category B · Special Honours
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent" />
          </div>

          <StaggerReveal
            className="mt-8 grid gap-5 sm:grid-cols-3 lg:mt-10 lg:gap-6"
            stagger={0.1}
            y={28}
          >
            {categoryGroupB.map(category => {
              const isLifetime = category.slug === 'lifetime'
              return (
                <StaggerItem key={category.id}>
                  <button
                    type="button"
                    onClick={() => setActive(category)}
                    data-cursor-hover
                    className="group/cat flex h-full w-full flex-col rounded-2xl border border-gold/25 bg-gradient-to-b from-gold/[0.06] to-transparent p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 lg:p-7"
                  >
                    <span
                      className={`flex size-2.5 rounded-full ${isLifetime ? 'bg-gold' : 'bg-royal'}`}
                    />
                    <h3 className="mt-5 font-display text-xl font-medium leading-tight text-ink lg:text-2xl">
                      {category.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                      {category.description}
                    </p>
                  </button>
                </StaggerItem>
              )
            })}
          </StaggerReveal>
        </div>
      </Container>

      <CategoryModal category={active} onClose={() => setActive(null)} />
    </Section>
  )
}

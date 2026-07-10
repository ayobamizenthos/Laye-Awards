'use client'

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { Category } from '@/types'
import { Section, Container } from '@/components/ui/Section'
import { StaggerReveal, StaggerItem } from '@/components/motion/StaggerReveal'
import { CategoryModal } from '@/components/categories/CategoryModal'

interface CategoryExplorerProps {
  groupA: Category[]
  groupB: Category[]
}

export function CategoryExplorer({ groupA, groupB }: CategoryExplorerProps) {
  const [active, setActive] = useState<Category | null>(null)

  return (
    <>
      <Section spacing="lg">
        <Container>
          <div className="flex items-baseline justify-between gap-4">
            <span className="eyebrow text-gold-deep">Competitive Awards</span>
            <span className="whitespace-nowrap text-sm text-ink-faint">
              {groupA.length} categories
            </span>
          </div>

          <StaggerReveal
            className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            stagger={0.03}
            y={24}
          >
            {groupA.map((category, index) => (
              <StaggerItem key={category.id} className="h-full">
                <button
                  type="button"
                  onClick={() => setActive(category)}
                  data-cursor-hover
                  className="group/cat flex h-full w-full items-center justify-between gap-4 rounded-xl border border-gold/20 bg-surface px-5 py-4 text-left transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-gold/55 hover:shadow-[0_18px_40px_-30px_rgba(151,116,42,0.55)]"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="font-sans text-xs font-medium tabular-nums text-gold-deep">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h2 className="font-display text-lg font-medium leading-tight text-ink">
                      {category.shortName}
                    </h2>
                  </div>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-gold-deep opacity-0 transition-all duration-300 group-hover/cat:translate-x-0.5 group-hover/cat:-translate-y-0.5 group-hover/cat:opacity-100"
                    strokeWidth={1.75}
                  />
                </button>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-raised">
        <Container>
          <span className="eyebrow text-gold-deep">Special Honours</span>
          <StaggerReveal className="mt-8 grid gap-4 lg:grid-cols-3" stagger={0.08} y={28}>
            {groupB.map(category => {
              const isLifetime = category.slug === 'lifetime'
              return (
                <StaggerItem key={category.id} className="h-full">
                  <button
                    type="button"
                    onClick={() => setActive(category)}
                    data-cursor-hover
                    className="group/cat flex h-full w-full flex-col rounded-2xl border border-gold/25 bg-surface p-7 text-left transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-gold/55 hover:shadow-[0_24px_50px_-32px_rgba(151,116,42,0.5)]"
                  >
                    <span
                      className={`flex size-2.5 rounded-full ${isLifetime ? 'bg-gold' : 'bg-royal'}`}
                    />
                    <h2 className="mt-5 font-display text-2xl font-medium leading-tight text-ink">
                      {category.name}
                    </h2>
                    <span className="mt-6 inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-gold-deep">
                      Read more
                      <ArrowUpRight
                        className="size-3.5 transition-transform duration-300 group-hover/cat:translate-x-0.5 group-hover/cat:-translate-y-0.5"
                        strokeWidth={2}
                      />
                    </span>
                  </button>
                </StaggerItem>
              )
            })}
          </StaggerReveal>
        </Container>
      </Section>

      <CategoryModal category={active} onClose={() => setActive(null)} />
    </>
  )
}

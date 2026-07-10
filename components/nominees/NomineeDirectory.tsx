'use client'

import { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { gsap, useGSAP, EDITORIAL_EASE, prefersReducedMotion } from '@/lib/gsap'
import { categories } from '@/lib/content/categories'
import type { Nominee } from '@/types'
import { Container } from '@/components/ui/Section'
import { NomineeCard } from '@/components/nominees/NomineeCard'
import { cn } from '@/lib/utils'

const ALL = 'all'

export function NomineeDirectory({ nominees }: { nominees: Nominee[] }) {
  const params = useSearchParams()
  const [activeCategory, setActiveCategory] = useState(params.get('category') ?? ALL)
  const [query, setQuery] = useState('')
  const gridRef = useRef<HTMLDivElement>(null)

  const activeCategories = useMemo(
    () => categories.filter(category => nominees.some(n => n.categorySlug === category.slug)),
    [nominees]
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return nominees.filter(nominee => {
      const matchesCategory = activeCategory === ALL || nominee.categorySlug === activeCategory
      const matchesQuery =
        needle === '' ||
        `${nominee.fullName} ${nominee.businessName}`.toLowerCase().includes(needle)
      return matchesCategory && matchesQuery
    })
  }, [activeCategory, query, nominees])

  useGSAP(
    () => {
      const grid = gridRef.current
      if (!grid) return
      const cards = grid.querySelectorAll<HTMLElement>('[data-card]')
      if (cards.length === 0) return

      if (prefersReducedMotion()) {
        gsap.set(cards, { opacity: 1, y: 0 })
        return
      }

      gsap.fromTo(
        cards,
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: EDITORIAL_EASE,
        }
      )
    },
    { scope: gridRef, dependencies: [filtered] }
  )

  return (
    <Container className="py-16 lg:py-24">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-faint"
            strokeWidth={1.75}
          />
          <input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search nominees"
            className="h-12 w-full rounded-full border border-hairline bg-surface pl-11 pr-4 text-sm text-ink outline-none transition-colors duration-300 placeholder:text-ink-faint focus:border-gold"
          />
        </div>
        <p className="text-sm text-ink-faint">
          {filtered.length} {filtered.length === 1 ? 'nominee' : 'nominees'}
        </p>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 lg:flex-wrap lg:overflow-visible lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <FilterTab
          label="All"
          active={activeCategory === ALL}
          onClick={() => setActiveCategory(ALL)}
        />
        {activeCategories.map(category => (
          <FilterTab
            key={category.id}
            label={category.shortName}
            active={activeCategory === category.slug}
            onClick={() => setActiveCategory(category.slug)}
          />
        ))}
      </div>

      {filtered.length > 0 ? (
        <div
          ref={gridRef}
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4"
        >
          {filtered.map((nominee, index) => (
            <div data-card key={nominee.id} className="h-full">
              <NomineeCard nominee={nominee} priority={index < 3} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center border-t border-hairline py-24 text-center">
          <p className="font-display text-3xl text-ink">No nominees here yet.</p>
          <p className="mt-3 max-w-sm text-ink-soft">
            Try another category, or clear your search to see everyone in the running.
          </p>
        </div>
      )}
    </Container>
  )
}

function FilterTab({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor-hover
      className={cn(
        'shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[0.72rem] font-medium uppercase tracking-[0.12em] transition-all duration-300',
        active
          ? 'bg-ink text-canvas'
          : 'border border-hairline text-ink-soft hover:border-ink/40 hover:text-ink'
      )}
    >
      {label}
    </button>
  )
}

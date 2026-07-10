'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, X } from 'lucide-react'
import type { Category } from '@/types'
import { categoryPitches } from '@/lib/content/categories'

interface CategoryModalProps {
  category: Category | null
  onClose: () => void
}

export function CategoryModal({ category, onClose }: CategoryModalProps) {
  useEffect(() => {
    if (!category) return
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [category, onClose])

  return (
    <AnimatePresence>
      {category && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-3 backdrop-blur-sm sm:items-center sm:p-6"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: 48, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 32, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={event => event.stopPropagation()}
            className="theme-light relative max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-surface p-7 text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] sm:rounded-3xl sm:p-9"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-gold/10 hover:text-ink"
            >
              <X className="size-5" strokeWidth={1.75} />
            </button>

            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-gold-deep">
              {category.group === 'B' ? 'Special Honour' : 'Award Category'}
            </p>
            <h3 className="mt-3 max-w-[18ch] font-display text-3xl font-medium leading-[1.1] sm:text-4xl">
              {category.name}
            </h3>

            <p className="mt-5 text-base leading-relaxed text-ink-soft sm:text-lg">
              {categoryPitches[category.slug] ?? category.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={`/apply?category=${category.slug}`}
                data-cursor-hover
                className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-deep px-7 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-onyx shadow-[0_12px_30px_-12px_rgba(203,169,78,0.7)] transition-transform duration-300 hover:scale-[1.02]"
              >
                Apply for this Award
                <ArrowUpRight className="size-4" strokeWidth={2} />
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-ink"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

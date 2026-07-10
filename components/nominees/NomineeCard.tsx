import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import type { Nominee } from '@/types'
import { getCategoryBySlug } from '@/lib/content/categories'
import { ShareButton } from '@/components/nominees/ShareButton'

interface NomineeCardProps {
  nominee: Nominee
  priority?: boolean
}

export function NomineeCard({ nominee, priority = false }: NomineeCardProps) {
  const category = getCategoryBySlug(nominee.categorySlug)
  const href = `/nominees/${nominee.slug}`
  const votes = nominee.voteCount.toLocaleString('en-NG')

  return (
    <div
      id={`nominee-${nominee.slug}`}
      className="group/card flex h-full scroll-mt-28 flex-col overflow-hidden rounded-3xl border border-hairline bg-surface shadow-[0_12px_40px_-28px_rgba(0,0,0,0.35)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-[0_30px_70px_-34px_rgba(203,169,78,0.45)] [&:target]:border-gold [&:target]:ring-2 [&:target]:ring-gold/40"
    >
      <Link href={href} data-cursor-hover className="relative block aspect-[4/5] overflow-hidden">
        <Image
          src={nominee.headshotUrl}
          alt={nominee.fullName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={priority}
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.05]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {category && (
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-gold-deep sm:text-[0.66rem]">
            {category.shortName}
          </span>
        )}
        <Link href={href} data-cursor-hover className="mt-1.5">
          <h3 className="font-display text-lg font-medium leading-tight text-ink transition-colors duration-300 group-hover/card:text-gold-deep sm:text-xl">
            {nominee.fullName}
          </h3>
        </Link>
        <p className="mt-1 truncate text-[0.78rem] text-ink-soft sm:text-sm">
          {nominee.businessName}
          {nominee.industry ? ` · ${nominee.industry}` : ''}
        </p>

        <div className="mt-3 inline-flex items-center gap-1.5 text-sm text-ink-soft">
          <Heart className="size-4 text-gold" strokeWidth={2} fill="currentColor" />
          <span className="font-medium tabular-nums text-ink">{votes}</span>
          <span className="text-ink-faint">{nominee.voteCount === 1 ? 'vote' : 'votes'}</span>
        </div>

        <div className="mt-4 flex items-center gap-2.5 sm:mt-5">
          <Link
            href={href}
            data-cursor-hover
            className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-gold px-5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-onyx transition-transform duration-300 hover:scale-[1.02]"
          >
            Vote
          </Link>
          <ShareButton slug={nominee.slug} fullName={nominee.fullName} />
        </div>
      </div>
    </div>
  )
}

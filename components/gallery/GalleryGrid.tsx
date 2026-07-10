import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin } from 'lucide-react'
import { editions } from '@/lib/content/content'
import { Container } from '@/components/ui/Section'
import { Reveal } from '@/components/motion/Reveal'
import { cn } from '@/lib/utils'

export function GalleryGrid() {
  return (
    <Container className="py-14 sm:py-20 lg:py-28">
      <div className="flex flex-col gap-16 sm:gap-24 lg:gap-32">
        {[...editions].reverse().map((edition, index) => {
          const flipped = index % 2 === 1
          const number = String(edition.number).padStart(2, '0')
          const clickable = !edition.noDetail
          const cardClass = 'group/ed grid items-center gap-7 lg:grid-cols-2 lg:gap-14'

          const inner = (
            <>
              <div
                className={cn(
                  'relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-gold/20 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/ed:border-gold/55',
                  flipped && 'lg:order-2'
                )}
              >
                <Image
                  src={edition.imageUrl}
                  alt={edition.ordinal}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/ed:scale-[1.04]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="pointer-events-none absolute left-4 top-3 font-display text-5xl font-medium text-white/85 [text-shadow:0_2px_24px_rgba(0,0,0,0.55)] sm:left-6 sm:top-4 sm:text-6xl">
                  {number}
                </span>
              </div>

              <div className={cn(flipped && 'lg:order-1')}>
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-gold-deep sm:text-[0.72rem]">
                  Edition {number}
                </p>
                <h2 className="mt-3 font-display text-3xl font-medium leading-tight text-ink sm:text-4xl lg:text-[2.75rem]">
                  {edition.ordinal}
                </h2>
                <p className="mt-4 flex items-center gap-2 text-sm text-ink-soft sm:text-base">
                  <MapPin className="size-4 shrink-0 text-gold-deep" strokeWidth={1.75} />
                  {edition.location}
                </p>
                <p className="mt-3 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg">
                  {edition.theme}
                </p>
                {clickable && (
                  <span className="mt-6 inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-gold-deep transition-colors group-hover/ed:text-gold">
                    View this edition
                    <ArrowRight
                      className="size-4 transition-transform duration-300 group-hover/ed:translate-x-0.5"
                      strokeWidth={2}
                    />
                  </span>
                )}
              </div>
            </>
          )

          return (
            <Reveal key={edition.number} y={40}>
              {clickable ? (
                <Link href={`/editions/${edition.slug}`} data-cursor-hover className={cardClass}>
                  {inner}
                </Link>
              ) : (
                <div className={cardClass}>{inner}</div>
              )}
            </Reveal>
          )
        })}
      </div>
    </Container>
  )
}

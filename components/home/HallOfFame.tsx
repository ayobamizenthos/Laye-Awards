'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { gsap, useGSAP } from '@/lib/gsap'
import { editions } from '@/lib/content/content'
import { siteConfig } from '@/config/site'
import { Container } from '@/components/ui/Section'
import { SectionIntro } from '@/components/ui/SectionIntro'

export function HallOfFame() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const scope = root.current
      if (!scope) return

      const pin = scope.querySelector<HTMLElement>('[data-pin]')
      const track = scope.querySelector<HTMLElement>('[data-track]')
      if (!pin || !track) return

      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)
        if (distance() === 0) return
        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })
      })

      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <section
      id="hall-of-fame"
      ref={root}
      className="overflow-hidden border-t border-hairline bg-surface pt-24 sm:pt-32 lg:pt-44"
    >
      <Container className="pb-14 sm:pb-16 lg:pb-20">
        <SectionIntro
          eyebrow="Hall of Fame"
          heading={
            <>
              Six editions of
              <br />
              <em className="italic text-gilded">recognition</em>.
            </>
          }
          lead="A platform built one ceremony at a time, and the night Lagos keeps coming back for."
        />
      </Container>

      <div
        data-pin
        className="relative flex h-dvh items-center pt-16 sm:pt-20 lg:pt-24 motion-reduce:block motion-reduce:h-auto motion-reduce:py-12 motion-reduce:pt-0"
      >
        <div
          data-track
          className="flex gap-5 px-[10vw] will-change-transform sm:gap-6 sm:px-[20vw] lg:gap-8 lg:px-[29vw] xl:px-[32vw] motion-reduce:snap-x motion-reduce:snap-mandatory motion-reduce:overflow-x-auto motion-reduce:px-5 motion-reduce:[scrollbar-width:none] motion-reduce:[&::-webkit-scrollbar]:hidden"
        >
          {[...editions].reverse().map(edition => {
            const clickable = !edition.noDetail
            const panelClass =
              'group/panel relative h-[64vh] w-[80vw] shrink-0 snap-center overflow-hidden rounded-2xl sm:h-[68vh] sm:w-[60vw] lg:w-[42vw] xl:w-[36vw]'
            const inner = (
              <>
                <Image
                  src={edition.imageUrl}
                  alt={`${edition.ordinal} of the ${siteConfig.fullName}`}
                  fill
                  loading="eager"
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 60vw, 42vw"
                  style={{ objectPosition: edition.coverPosition ?? 'center top' }}
                  className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/panel:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-onyx/95 via-onyx/45 to-onyx/10" />

                <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-7 lg:p-9">
                  <div className="flex items-start justify-between">
                    <span className="font-display text-6xl font-medium leading-none text-white/90 sm:text-7xl lg:text-8xl">
                      {String(edition.number).padStart(2, '0')}
                    </span>
                  </div>
                  <div>
                    <p className="eyebrow text-gold-light">{edition.ordinal}</p>
                    <p className="mt-3 max-w-md font-display text-xl leading-snug text-white sm:text-2xl lg:text-3xl">
                      {edition.theme}
                    </p>
                    {clickable && (
                      <p className="mt-4 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-gold-light opacity-0 transition-opacity duration-300 group-hover/panel:opacity-100">
                        View this edition
                        <ArrowRight className="size-3.5" strokeWidth={2} />
                      </p>
                    )}
                  </div>
                </div>
              </>
            )
            return clickable ? (
              <Link
                key={edition.number}
                href={`/editions/${edition.slug}`}
                data-cursor-hover
                className={panelClass}
              >
                {inner}
              </Link>
            ) : (
              <div key={edition.number} className={panelClass}>
                {inner}
              </div>
            )
          })}

          <article className="relative flex h-[64vh] w-[80vw] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-2xl border border-gold/40 bg-canvas p-6 sm:h-[68vh] sm:w-[60vw] sm:p-7 lg:w-[42vw] lg:p-9 xl:w-[36vw]">
            <span className="font-display text-6xl font-medium leading-none text-gilded sm:text-7xl lg:text-8xl">
              {String(siteConfig.edition.number).padStart(2, '0')}
            </span>
            <div>
              <p className="eyebrow text-gold-deep">The next edition</p>
              <p className="mt-3 max-w-sm font-display text-xl leading-snug text-ink sm:text-2xl lg:text-3xl">
                The next chapter is yours to write.
              </p>
              <Link
                href="/apply"
                data-cursor-hover
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:text-gold-deep"
              >
                Register now
                <ArrowRight className="size-4" strokeWidth={1.75} />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

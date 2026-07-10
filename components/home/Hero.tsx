'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap, SplitText, useGSAP, EDITORIAL_EASE, prefersReducedMotion } from '@/lib/gsap'
import { onIntroComplete } from '@/lib/intro'
import { Container } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const scope = root.current
      if (!scope) return

      const headline = scope.querySelector<HTMLElement>('[data-hero-headline]')
      const fadeItems = scope.querySelectorAll<HTMLElement>('[data-hero-fade]')
      const awardImg = scope.querySelector<HTMLElement>('[data-hero-award]')

      if (prefersReducedMotion()) {
        gsap.set([headline, ...fadeItems, awardImg], { opacity: 1, y: 0, scale: 1 })
        return
      }

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: EDITORIAL_EASE },
      })

      if (awardImg) {
        tl.fromTo(awardImg, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 2.2 }, 0)
      }

      if (headline) {
        gsap.set(headline, { opacity: 1 })
        SplitText.create(headline, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: self =>
            tl.from(self.lines, { yPercent: 120, duration: 1.3, stagger: 0.14 }, 0.15),
        })
      }

      tl.fromTo(
        fadeItems,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.1, stagger: 0.13 },
        0.7
      )

      return onIntroComplete(() => tl.play())
    },
    { scope: root }
  )

  return (
    <section
      ref={root}
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden pt-20 pb-10 sm:pt-24 sm:pb-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[65vh] bg-[radial-gradient(ellipse_55%_60%_at_50%_0%,rgba(201,168,76,0.16),transparent_72%)]"
      />

      <div
        data-hero-award
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 overflow-hidden"
      >
        <Image
          src="/award-mobile.png"
          alt="LAYEAWARDS Trophy"
          fill
          className="object-cover object-center sm:hidden"
          priority
        />
        <Image
          src="/award-promo.png"
          alt="LAYEAWARDS Trophy"
          fill
          className="hidden sm:block object-cover object-center"
          priority
        />
      </div>

      {/* Legibility overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx/95 via-onyx/45 to-onyx/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-onyx/80 via-onyx/20 to-transparent lg:via-transparent"
      />

      <Container className="relative z-10 flex flex-1 flex-col justify-end">
        <div className="max-w-2xl">
          <h1
            data-hero-headline
            className="text-balance font-display text-hero font-medium text-ink opacity-0 [text-shadow:0_2px_40px_rgba(12,10,7,0.65)]"
          >
            The night Lagos honours its <em className="font-medium italic text-gilded">boldest</em>{' '}
            young founders.
          </h1>

          <p
            data-hero-fade
            className="mt-5 max-w-lg text-balance text-sm leading-relaxed text-ink-soft sm:text-base lg:text-lg"
          >
            Forty-three awards, decided by the public vote. Register your enterprise, or back the
            founders you believe in.
          </p>

          <div
            data-hero-fade
            className="mt-9 flex w-full flex-row items-center gap-3 sm:mt-10 sm:w-auto sm:gap-4"
          >
            <div className="flex-1 sm:flex-none">
              <Button href="/apply" size="md" withArrow className="w-full">
                Register Now
              </Button>
            </div>
            <div className="flex-1 sm:flex-none">
              <Button href="/nominees" size="md" variant="secondary" className="w-full">
                Vote Now
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

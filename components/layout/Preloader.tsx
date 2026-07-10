'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { markIntroComplete } from '@/lib/intro'

const SESSION_KEY = 'laye-intro-shown'

export function Preloader() {
  const root = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)

  useGSAP(
    () => {
      const scope = root.current
      if (!scope) return

      const alreadyShown = sessionStorage.getItem(SESSION_KEY) === '1'

      if (alreadyShown || prefersReducedMotion()) {
        sessionStorage.setItem(SESSION_KEY, '1')
        markIntroComplete()
        setDone(true)
        return
      }

      document.documentElement.style.overflow = 'hidden'
      const counter = { value: 0 }
      const numberEl = scope.querySelector<HTMLElement>('[data-intro-count]')

      const timeline = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem(SESSION_KEY, '1')
          document.documentElement.style.overflow = ''
          markIntroComplete()
          setDone(true)
        },
      })

      timeline
        .from('[data-intro-logo]', {
          opacity: 0,
          scale: 0.82,
          duration: 1,
          ease: 'power3.out',
        })
        .to(
          counter,
          {
            value: 100,
            duration: 1.7,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (numberEl) {
                numberEl.textContent = String(Math.round(counter.value)).padStart(3, '0')
              }
            },
          },
          0.25
        )
        .to('[data-intro-bar]', { scaleX: 1, duration: 1.7, ease: 'power2.inOut' }, 0.25)
        .to(
          '[data-intro-logo], [data-intro-meta]',
          { opacity: 0, y: -24, duration: 0.6, ease: 'power2.in' },
          '+=0.25'
        )
        .to(scope, { yPercent: -100, duration: 1, ease: 'power4.inOut' }, '-=0.2')
    },
    { scope: root }
  )

  if (done) return null

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-onyx"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_45%_at_50%_45%,rgba(201,168,76,0.14),transparent_70%)]"
      />
      <div data-intro-logo className="relative">
        <Image
          src="/laye-emblem.png"
          alt="LAYEAWARDS"
          width={497}
          height={461}
          priority
          className="h-24 w-auto lg:h-28"
        />
      </div>
      <div data-intro-meta className="relative mt-9 flex flex-col items-center gap-3.5">
        <span data-intro-count className="font-display text-xl tabular-nums text-gold">
          000
        </span>
        <span className="block h-px w-44 overflow-hidden bg-hairline">
          <span data-intro-bar className="block h-full w-full origin-left scale-x-0 bg-gold" />
        </span>
        <span className="text-[0.6rem] uppercase tracking-[0.32em] text-ink-faint">
          Lagos Young Entrepreneurs Awards
        </span>
      </div>
    </div>
  )
}

'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { gsap, useGSAP } from '@/lib/gsap'
import { press } from '@/lib/content/content'
import { Section, Container } from '@/components/ui/Section'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { StaggerReveal, StaggerItem } from '@/components/motion/StaggerReveal'
import { Reveal } from '@/components/motion/Reveal'
import { Button } from '@/components/ui/Button'
import type { PressMention } from '@/types'

export function Press() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const scope = root.current
      if (!scope) return
      const pin = scope.querySelector<HTMLElement>('[data-press-pin]')
      const track = scope.querySelector<HTMLElement>('[data-press-track]')
      if (!pin || !track) return

      const mm = gsap.matchMedia()
      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
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
    <Section className="theme-light relative overflow-hidden border-t border-hairline">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_50%,rgba(151,116,42,0.08),transparent_72%)]"
      />
      <div ref={root}>
        <Container className="relative">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <SectionIntro
              eyebrow="The Blog"
              heading={
                <>
                  Featured stories on
                  <br />
                  <em className="italic text-gilded">LAYEAWARDS</em>.
                </>
              }
              lead="Editorial coverage from the publications watching the Lagos enterprise scene."
            />
            <Reveal delay={0.1} className="hidden lg:block">
              <Button href="/blog" withArrow>
                View Full Blog
              </Button>
            </Reveal>
          </div>

          <StaggerReveal
            className="mt-12 hidden lg:grid lg:grid-cols-3 lg:gap-6"
            stagger={0.1}
            y={36}
          >
            {press.map(item => (
              <StaggerItem key={item.id} className="h-full">
                <PressCard item={item} />
              </StaggerItem>
            ))}
          </StaggerReveal>
        </Container>

        <div
          data-press-pin
          className="relative mt-8 flex h-dvh items-center pt-16 sm:mt-10 sm:pt-20 lg:hidden"
        >
          <div
            data-press-track
            className="flex gap-5 px-[10vw] will-change-transform sm:gap-6 sm:px-[20vw]"
          >
            {press.map(item => (
              <article key={item.id} className="h-[68vh] w-[80vw] shrink-0 sm:h-[70vh] sm:w-[60vw]">
                <PressCard item={item} />
              </article>
            ))}
          </div>
        </div>
      </div>

      <Container className="relative">
        <div className="mt-7 lg:hidden">
          <Button href="/blog" withArrow className="w-full">
            View Full Blog
          </Button>
        </div>
      </Container>
    </Section>
  )
}

function PressCard({ item }: { item: PressMention }) {
  return (
    <a
      href={item.articleUrl}
      target="_blank"
      rel="noreferrer noopener"
      data-cursor-hover
      className="group/post relative flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-surface transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-gold/45 hover:shadow-[0_28px_60px_-30px_rgba(151,116,42,0.45)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-canvas">
        <Image
          src={item.logoUrl}
          alt={`${item.publication} logo`}
          fill
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 60vw, 33vw"
          className="object-contain p-7 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/post:scale-[1.04] sm:p-9 lg:p-12"
        />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold-deep sm:text-[0.7rem]">
            {item.publication}
          </span>
          <span className="size-1 rounded-full bg-gold/50" />
          <span className="text-[0.62rem] uppercase tracking-[0.14em] text-ink-faint sm:text-xs">
            {item.publishedDate}
          </span>
        </div>
        <h3 className="mt-3 font-display text-lg leading-snug text-ink transition-colors duration-300 group-hover/post:text-gold-deep sm:text-xl lg:text-2xl">
          {item.headline}
        </h3>
        {item.excerpt && (
          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-soft">
            {item.excerpt}
          </p>
        )}
        <span className="mt-5 inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-ink-soft transition-colors duration-300 group-hover/post:text-gold sm:text-[0.7rem]">
          Read article
          <ArrowUpRight
            className="size-3.5 transition-transform duration-300 group-hover/post:translate-x-0.5 group-hover/post:-translate-y-0.5"
            strokeWidth={1.75}
          />
        </span>
      </div>
    </a>
  )
}

'use client'

import { useRef } from 'react'
import { FilePen, ListChecks, Share2, Trophy } from 'lucide-react'
import { gsap, useGSAP, EDITORIAL_EASE, prefersReducedMotion } from '@/lib/gsap'
import { processSteps } from '@/lib/content/content'
import { Section, Container } from '@/components/ui/Section'
import { SectionIntro } from '@/components/ui/SectionIntro'

const stepIcons = [FilePen, ListChecks, Share2, Trophy]

export function HowItWorks() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const scope = root.current
      if (!scope || prefersReducedMotion()) return

      const line = scope.querySelector<HTMLElement>('[data-connector]')
      const steps = scope.querySelectorAll<HTMLElement>('[data-step]')

      if (line) {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.5,
            ease: EDITORIAL_EASE,
            scrollTrigger: { trigger: scope, start: 'top 62%' },
          }
        )
      }

      gsap.fromTo(
        steps,
        { opacity: 0, y: 52 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.18,
          ease: EDITORIAL_EASE,
          scrollTrigger: { trigger: scope, start: 'top 68%' },
        }
      )
    },
    { scope: root }
  )

  return (
    <Section className="theme-light">
      <Container>
        <SectionIntro
          align="center"
          eyebrow="The Process"
          heading={
            <>
              From application to
              <br />
              <em className="italic text-gilded">acclaim</em>.
            </>
          }
          lead="Four steps to the LAYEAWARDS stage."
        />

        <div ref={root} className="relative mt-10 sm:mt-14 lg:mt-20">
          <div className="absolute left-0 right-0 top-7 hidden lg:block lg:top-8">
            <div
              data-connector
              className="rule-gold h-px origin-left"
              style={{ marginInline: '12.5%' }}
            />
          </div>

          <ol className="grid grid-cols-2 gap-7 sm:gap-9 lg:grid-cols-4 lg:gap-6">
            {processSteps.map((step, index) => {
              const Icon = stepIcons[index]
              return (
                <li
                  key={step.index}
                  data-step
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative flex size-14 items-center justify-center rounded-full border border-gold/50 bg-[#141110] text-gold shadow-[0_10px_30px_-12px_rgba(20,17,16,0.5)] sm:size-16 lg:size-18">
                    <Icon className="size-5 sm:size-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-medium text-ink sm:mt-5 sm:text-xl lg:mt-6 lg:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-xs leading-relaxed text-ink-soft sm:mt-3 sm:text-sm lg:text-base">
                    {step.description}
                  </p>
                </li>
              )
            })}
          </ol>
        </div>
      </Container>
    </Section>
  )
}

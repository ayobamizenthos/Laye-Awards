import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Container } from '@/components/ui/Section'
import { RevealHeading } from '@/components/motion/RevealHeading'
import { Reveal } from '@/components/motion/Reveal'
import { Magnetic } from '@/components/motion/Magnetic'

export function CTABanner() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(130deg,#281a0c_0%,#6e521a_44%,#c39a3a_100%)] px-6 py-20 sm:px-12 lg:px-20 lg:py-32">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[60%] animate-[cta-glow_9s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(240,208,128,0.45),transparent_65%)]"
          />

          <div className="relative flex flex-col items-center text-center">
            <RevealHeading
              as="h2"
              className="mt-7 text-balance font-display text-display font-medium text-white [text-shadow:0_2px_30px_rgba(12,10,7,0.45)]"
            >
              Excellence deserves an audience.
            </RevealHeading>

            <Reveal
              y={24}
              delay={0.1}
              className="mt-6 max-w-xl text-lg leading-relaxed text-white/85"
            >
              Apply for the open edition, or back the founders you believe in. The stage is set.
            </Reveal>

            <Reveal delay={0.2} className="mt-11 flex flex-col items-center gap-4 sm:flex-row">
              <Magnetic strength={0.28}>
                <Link
                  href="/apply"
                  data-cursor-hover
                  className="group/cta inline-flex h-15 items-center justify-center gap-2.5 rounded-full bg-white px-10 font-sans text-[0.84rem] font-semibold uppercase tracking-[0.16em] text-onyx shadow-[0_12px_34px_-12px_rgba(0,0,0,0.45)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03]"
                >
                  Register Now
                  <ArrowUpRight
                    className="size-4 transition-transform duration-500 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                    strokeWidth={1.75}
                  />
                </Link>
              </Magnetic>

              <Magnetic strength={0.28}>
                <Link
                  href="/sponsorship"
                  data-cursor-hover
                  className="inline-flex h-15 items-center justify-center rounded-full px-10 font-sans text-[0.84rem] font-semibold uppercase tracking-[0.16em] text-white ring-1 ring-inset ring-white/45 transition-colors duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/10"
                >
                  Become a Sponsor
                </Link>
              </Magnetic>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}

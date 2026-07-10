import { siteConfig } from '@/config/site'
import { Section, Container } from '@/components/ui/Section'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Reveal } from '@/components/motion/Reveal'
import { StaggerReveal, StaggerItem } from '@/components/motion/StaggerReveal'
import { CountUp } from '@/components/motion/CountUp'

export function About() {
  return (
    <Section id="about" className="theme-light">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <SectionIntro
              eyebrow="The Mission"
              heading={
                <>
                  An award with a
                  <br />
                  <em className="italic text-gilded">reason</em> behind it.
                </>
              }
            />
          </div>

          <div className="space-y-5 lg:col-span-6 lg:col-start-7 lg:space-y-6 lg:pt-2">
            <Reveal y={28} className="text-base leading-relaxed text-ink-soft sm:text-lg">
              The {siteConfig.fullName} turns the spotlight on the young people building the
              businesses that move Lagos, not the obvious names, the ones doing the work.
            </Reveal>
            <Reveal
              y={28}
              delay={0.08}
              className="text-base leading-relaxed text-ink-soft sm:text-lg"
            >
              Six editions in, LAYEAWARDS is the night of recognition, mentorship and consequence
              for founders under fifty making their mark on Africa&apos;s most ambitious city.
            </Reveal>
            <Reveal delay={0.16} className="flex items-start gap-4 pt-4 sm:gap-5 sm:pt-6">
              <span className="mt-2.5 h-px w-10 shrink-0 bg-gold sm:mt-3 sm:w-12" />
              <p className="font-display text-xl italic leading-snug text-ink sm:text-2xl lg:text-[1.7rem]">
                Built for the room that decides what comes next.
              </p>
            </Reveal>
          </div>
        </div>

        <StaggerReveal
          className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 sm:mt-14 lg:mt-20 lg:flex lg:items-end lg:gap-x-16"
          stagger={0.14}
          y={36}
        >
          {siteConfig.figures.map((figure, index) => (
            <StaggerItem key={figure.label} className="relative lg:flex-1">
              {index > 0 && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute -left-8 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-gold/35 to-transparent lg:block"
                />
              )}
              <p className="font-display text-4xl font-medium leading-none text-gilded sm:text-5xl lg:text-7xl">
                <CountUp value={figure.value} suffix={figure.suffix} />
              </p>
              <p className="mt-3 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-ink-soft sm:text-[0.7rem] sm:tracking-[0.18em] lg:mt-5 lg:text-[0.78rem]">
                {figure.label}
              </p>
              <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-ink-faint sm:text-sm lg:mt-3">
                {figure.note}
              </p>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </Container>
    </Section>
  )
}

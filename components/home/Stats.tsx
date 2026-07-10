import { siteConfig } from '@/config/site'
import { Section, Container } from '@/components/ui/Section'
import { StaggerReveal, StaggerItem } from '@/components/motion/StaggerReveal'
import { CountUp } from '@/components/motion/CountUp'

export function Stats() {
  return (
    <div className="theme-light">
      <Section spacing="sm">
        <Container>
          <StaggerReveal
            className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6"
            stagger={0.14}
            y={32}
          >
            {siteConfig.figures.map((figure, index) => (
              <StaggerItem key={figure.label} className="relative text-center">
                {index > 0 && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -left-3 top-1/2 hidden h-20 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-gold/35 to-transparent sm:block"
                  />
                )}
                <p className="font-display text-5xl font-medium leading-none text-gilded sm:text-6xl lg:text-7xl">
                  <CountUp value={figure.value} suffix={figure.suffix} />
                </p>
                <p className="mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink-soft sm:text-[0.78rem]">
                  {figure.label}
                </p>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink-faint">
                  {figure.note}
                </p>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </Container>
      </Section>
    </div>
  )
}

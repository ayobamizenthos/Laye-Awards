import { founderWord } from '@/lib/content/content'
import { Section, Container } from '@/components/ui/Section'
import { RevealHeading } from '@/components/motion/RevealHeading'
import { Reveal } from '@/components/motion/Reveal'

export function FounderWord() {
  return (
    <Section className="relative overflow-hidden border-t border-hairline bg-surface">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[40vh] bg-[radial-gradient(ellipse_45%_55%_at_50%_0%,rgba(201,168,76,0.12),transparent_70%)]"
      />
      <Container className="relative">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <Reveal y={20}>
            <span
              aria-hidden
              className="font-display text-[4rem] leading-[0.6] text-gold/30 sm:text-[5rem] lg:text-[7rem]"
            >
              &ldquo;
            </span>
          </Reveal>

          <RevealHeading
            as="p"
            className="mt-2 text-balance font-display text-2xl font-medium italic text-ink sm:text-3xl lg:text-4xl"
          >
            {founderWord.quote}
          </RevealHeading>

          <Reveal
            y={26}
            delay={0.1}
            className="mt-6 max-w-2xl text-base leading-relaxed text-ink-soft sm:mt-7 sm:text-lg"
          >
            {founderWord.context}
          </Reveal>

          <Reveal delay={0.2} className="mt-7 flex flex-col items-center sm:mt-9">
            <span className="rule-gold h-px w-12 sm:w-14" />
            <p className="mt-5 font-display text-xl text-ink sm:text-2xl">
              {founderWord.attribution}
            </p>
            <p className="mt-1 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-ink-faint sm:text-[0.78rem]">
              {founderWord.role}
            </p>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}

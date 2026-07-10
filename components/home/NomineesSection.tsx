import { siteConfig } from '@/config/site'
import { Section, Container } from '@/components/ui/Section'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { StaggerReveal, StaggerItem } from '@/components/motion/StaggerReveal'
import { Reveal } from '@/components/motion/Reveal'
import { Button } from '@/components/ui/Button'

const phases = [
  {
    tag: 'Now Open',
    title: 'Registration',
    window: `${siteConfig.timeline.nominationsOpen} – ${siteConfig.timeline.nominationsClose}`,
    description: 'Register your enterprise. The panel verifies every entry.',
  },
  {
    tag: 'Coming Soon',
    title: 'Public Voting',
    window: `${siteConfig.timeline.votingOpens} – ${siteConfig.timeline.votingCloses}`,
    description: 'Four finalists per category. The city decides each winner.',
  },
  {
    tag: 'Save the Date',
    title: 'The Ceremony',
    window: 'Lagos · Date to be announced',
    description: 'Winners are crowned before the room that shapes Lagos.',
  },
]

export function NomineesSection() {
  return (
    <Section id="nominees" className="">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntro
            eyebrow="The Public Vote"
            heading={
              <>
                The city decides its
                <br />
                <em className="italic text-gilded">winners</em>.
              </>
            }
            lead="Every title is settled by public vote: four finalists, one decided by Lagos."
          />
          <Reveal delay={0.1} className="hidden lg:block">
            <Button href="/apply" withArrow>
              Register a Nomination
            </Button>
          </Reveal>
        </div>

        <StaggerReveal
          className="mt-10 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-6"
          stagger={0.1}
        >
          {phases.map(phase => (
            <StaggerItem key={phase.tag} className="h-full">
              <div className="flex h-full flex-col rounded-2xl border border-hairline bg-surface p-5 sm:p-6 lg:p-7">
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-gold-deep sm:text-[0.7rem]">
                  {phase.tag}
                </span>
                <h3 className="mt-3 font-display text-xl font-medium text-ink sm:mt-4 sm:text-2xl lg:text-3xl">
                  {phase.title}
                </h3>
                <p className="mt-1.5 text-xs font-medium text-gold sm:mt-2 sm:text-sm">
                  {phase.window}
                </p>
                <p className="mt-3 flex-1 text-xs leading-relaxed text-ink-soft sm:text-sm">
                  {phase.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerReveal>

        <div className="mt-7 lg:hidden">
          <Button href="/apply" withArrow className="w-full">
            Register a Nomination
          </Button>
        </div>
      </Container>
    </Section>
  )
}

import { sponsorshipTiers } from '@/lib/content/content'
import { Section, Container } from '@/components/ui/Section'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { StaggerReveal, StaggerItem } from '@/components/motion/StaggerReveal'
import { Reveal } from '@/components/motion/Reveal'
import { Button } from '@/components/ui/Button'
import { SponsorTierCard } from '@/components/sponsorship/SponsorTierCard'

export function SponsorshipHome() {
  return (
    <div className="theme-light">
      <Section spacing="lg" className="bg-surface">
        <Container>
          <SectionIntro
            align="center"
            eyebrow="Sponsorship"
            heading={
              <>
                Put your brand on Lagos&apos; boldest <em className="italic text-gilded">night</em>.
              </>
            }
            lead="An audience of investors, government and corporate leaders. Six ways to partner, each built for measurable return."
          />

          <StaggerReveal
            className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3"
            stagger={0.07}
            y={26}
          >
            {sponsorshipTiers.map(tier => (
              <StaggerItem key={tier.name} className="h-full">
                <SponsorTierCard tier={tier} />
              </StaggerItem>
            ))}
          </StaggerReveal>

          <Reveal delay={0.1} className="mt-12 flex justify-center">
            <Button href="/sponsorship" size="md" withArrow>
              Explore Sponsorship
            </Button>
          </Reveal>
        </Container>
      </Section>
    </div>
  )
}

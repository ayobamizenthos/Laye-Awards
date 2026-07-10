import { Container } from '@/components/ui/Section'
import { SectionIntro } from '@/components/ui/SectionIntro'

interface PageHeaderProps {
  eyebrow: string
  heading: React.ReactNode
  lead?: string
}

export function PageHeader({ eyebrow, heading, lead }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 lg:pt-48 lg:pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[55vh] bg-[radial-gradient(ellipse_45%_60%_at_50%_0%,rgba(201,168,76,0.12),transparent_72%)]"
      />
      <Container className="relative">
        <SectionIntro
          as="h1"
          eyebrow={eyebrow}
          heading={heading}
          lead={lead}
          className="max-w-4xl"
        />
      </Container>
    </section>
  )
}

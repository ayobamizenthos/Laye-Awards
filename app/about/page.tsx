import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section, Container } from '@/components/ui/Section'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Reveal } from '@/components/motion/Reveal'
import { RevealHeading } from '@/components/motion/RevealHeading'
import { StaggerReveal, StaggerItem } from '@/components/motion/StaggerReveal'
import { CountUp } from '@/components/motion/CountUp'

export const metadata: Metadata = {
  title: 'About',
  description:
    'The Lagos Young Entrepreneurs Awards, built to inspire, reward and empower the next generation of business leaders.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: `About · ${siteConfig.name}`,
    description: 'Built to inspire, reward and empower the next generation of Lagos founders.',
    url: `${siteConfig.url}/about`,
  },
}

const businessHalf = [
  'Entrepreneurship Masterclass',
  'Structured mentorship sessions',
  '40 competitive awards & 3 special honours',
  'Lifetime Achievement investiture',
]

const spectacleHalf = [
  'Miss Entrepreneur Lagos pageant',
  'Top Nigerian artists & comedy',
  'A curated fashion showcase',
  'Red carpet & magazine launch',
]

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About LAYEAWARDS"
        heading={
          <>
            An award built to <em className="italic text-gilded">empower</em> a generation.
          </>
        }
        lead="Inspiring excellence and rewarding the young founders reshaping Lagos."
      />

      <div className="theme-light">
        <Section spacing="lg">
          <Container>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-4">
                <SectionIntro eyebrow="The Story" heading="Why it exists." />
              </div>
              <div className="space-y-6 lg:col-span-7 lg:col-start-6">
                <Reveal y={28} className="font-display text-3xl leading-snug text-ink lg:text-4xl">
                  LAYEAWARDS exists to inspire and empower the next generation of business leaders,
                  a pipeline of innovators driving jobs across Lagos.
                </Reveal>
                <Reveal y={26} delay={0.1} className="text-lg leading-relaxed text-ink-soft">
                  Six editions in, it is the room where investors, corporate leaders and government
                  gather to recognise young enterprise, done at a standard worthy of the founders it
                  celebrates.
                </Reveal>
              </div>
            </div>

            <StaggerReveal
              className="mt-16 flex flex-col gap-y-12 lg:mt-24 lg:flex-row lg:items-end lg:gap-x-16"
              stagger={0.14}
              y={36}
            >
              {siteConfig.figures.map(figure => (
                <StaggerItem key={figure.label} className="flex-1">
                  <p className="font-display text-7xl font-medium leading-none text-gilded lg:text-8xl">
                    <CountUp value={figure.value} suffix={figure.suffix} />
                  </p>
                  <p className="mt-5 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-ink-soft">
                    {figure.label}
                  </p>
                </StaggerItem>
              ))}
            </StaggerReveal>
          </Container>
        </Section>

        <Section spacing="lg" className="bg-surface">
          <Container>
            <SectionIntro
              align="center"
              eyebrow="The Evening"
              heading={
                <>
                  Where business meets <em className="italic text-gilded">spectacle</em>.
                </>
              }
              lead="One night, two halves: the rigour of enterprise and the glamour of a Lagos gala."
            />
            <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-2">
              <Reveal y={40}>
                <HalfCard title="The Business" items={businessHalf} />
              </Reveal>
              <Reveal y={40} delay={0.1}>
                <HalfCard title="The Spectacle" items={spectacleHalf} gilded />
              </Reveal>
            </div>
          </Container>
        </Section>

        <Section spacing="lg">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <span className="eyebrow text-gold-deep">Leadership</span>
              <RevealHeading
                as="h2"
                className="mt-6 font-display text-display font-medium text-ink"
              >
                {siteConfig.leadership.name}
              </RevealHeading>
              <Reveal y={22} delay={0.1} className="mt-3">
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                  {siteConfig.leadership.title}
                </p>
              </Reveal>
              <Reveal y={26} delay={0.16} className="mt-8 text-lg leading-relaxed text-ink-soft">
                Under {siteConfig.leadership.name.split(' ')[0]}&apos;s direction, LAYEAWARDS has
                grown from an idea into one of Lagos&apos; most recognised celebrations of young
                enterprise, built on the belief that recognition, done properly, changes what
                founders believe is possible.
              </Reveal>
            </div>
          </Container>
        </Section>
      </div>
    </>
  )
}

function HalfCard({
  title,
  items,
  gilded = false,
}: {
  title: string
  items: string[]
  gilded?: boolean
}) {
  return (
    <div
      className={`h-full rounded-2xl border p-8 lg:p-10 ${
        gilded
          ? 'border-gold/35 bg-gradient-to-b from-gold/[0.08] to-transparent'
          : 'border-hairline bg-canvas'
      }`}
    >
      <h3 className="font-display text-3xl font-medium text-ink lg:text-4xl">{title}</h3>
      <ul className="mt-7 space-y-4">
        {items.map(item => (
          <li
            key={item}
            className="flex items-center gap-3.5 border-b border-hairline pb-4 text-base text-ink-soft last:border-0 last:pb-0"
          >
            <span className="size-1.5 shrink-0 rounded-full bg-gold" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

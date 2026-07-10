import Image from 'next/image'
import { experiences, distinguishedGuests } from '@/lib/content/content'
import { Section, Container } from '@/components/ui/Section'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Reveal } from '@/components/motion/Reveal'
import { Marquee } from '@/components/ui/Marquee'

export function Experience() {
  return (
    <Section>
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <Reveal y={28} className="lg:col-span-7">
            <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-hairline">
              <Image
                src="/award-promo.png"
                alt="A LAYEAWARDS honouree on the night"
                fill
                sizes="(max-width: 1024px) 90vw, 55vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-onyx/70 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-5 sm:p-7 lg:p-9">
                <p className="font-display text-xl text-white sm:text-2xl lg:text-3xl">
                  Business meets spectacle.
                </p>
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold-light sm:text-[0.7rem]">
                  Lagos · One night
                </span>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-5">
            <SectionIntro
              eyebrow="The Experience"
              heading={
                <>
                  Far more than an
                  <br />
                  awards <em className="italic text-gilded">night</em>.
                </>
              }
            />
            <ul className="mt-7 grid grid-cols-2 gap-x-4 gap-y-3 sm:mt-8 sm:gap-x-6">
              {experiences.map(item => (
                <li key={item.title} className="flex items-start gap-3">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                  <span className="font-display text-sm leading-tight text-ink sm:text-base lg:text-lg">
                    {item.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      <Reveal className="mt-12 lg:mt-16">
        <p className="eyebrow mb-4 px-5 text-center text-gold-deep sm:mb-5 sm:px-8">In the Room</p>
        <Marquee>
          {distinguishedGuests.map(guest => (
            <span key={guest} className="flex items-center whitespace-nowrap">
              <span className="px-5 font-display text-lg text-ink/75 sm:px-6 sm:text-xl lg:px-8 lg:text-2xl">
                {guest}
              </span>
              <svg viewBox="0 0 24 24" className="size-2.5 shrink-0 text-gold" aria-hidden>
                <path
                  d="M12 0 L14.35 9.65 L24 12 L14.35 14.35 L12 24 L9.65 14.35 L0 12 L9.65 9.65 Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          ))}
        </Marquee>
      </Reveal>
    </Section>
  )
}

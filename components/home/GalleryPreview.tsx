import Image from 'next/image'
import { galleryImages } from '@/lib/content/content'
import { Section, Container } from '@/components/ui/Section'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Reveal } from '@/components/motion/Reveal'
import { StaggerReveal, StaggerItem } from '@/components/motion/StaggerReveal'
import { Button } from '@/components/ui/Button'

export function GalleryPreview() {
  const images = galleryImages.slice(0, 3)

  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntro
            eyebrow="Moments of Excellence"
            heading={
              <>
                The night, as it
                <br />
                <em className="italic text-gilded">unfolds</em>.
              </>
            }
          />
          <Reveal delay={0.1} className="hidden lg:block">
            <Button href="/gallery" withArrow>
              Open the Gallery
            </Button>
          </Reveal>
        </div>

        <StaggerReveal
          className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 md:grid-cols-3 lg:mt-14 lg:gap-5"
          stagger={0.08}
        >
          {images.map((image, index) => (
            <StaggerItem key={image.id} className="group/tile">
              <figure
                data-cursor-hover
                className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-hairline transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/tile:-translate-y-1 group-hover/tile:border-gold/45 group-hover/tile:shadow-[0_28px_60px_-30px_rgba(203,169,78,0.4)]"
              >
                <Image
                  src={image.imageUrl}
                  alt={image.caption}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 45vw, 24vw"
                  priority={index < 2}
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/tile:scale-[1.06]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-onyx/95 via-onyx/30 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover/tile:opacity-100 sm:p-5">
                  <figcaption className="text-[0.78rem] font-medium leading-tight text-white sm:text-sm">
                    {image.caption}
                  </figcaption>
                </div>
              </figure>
            </StaggerItem>
          ))}
        </StaggerReveal>

        <div className="mt-7 lg:hidden">
          <Button href="/gallery" withArrow className="w-full">
            Open the Gallery
          </Button>
        </div>
      </Container>
    </Section>
  )
}

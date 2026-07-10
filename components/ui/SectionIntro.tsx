import { RevealHeading } from '@/components/motion/RevealHeading'
import { Reveal } from '@/components/motion/Reveal'
import { cn } from '@/lib/utils'

interface SectionIntroProps {
  eyebrow: string
  heading: React.ReactNode
  lead?: string
  align?: 'left' | 'center'
  as?: 'h1' | 'h2' | 'h3'
  className?: string
}

export function SectionIntro({
  eyebrow,
  heading,
  lead,
  align = 'left',
  as = 'h2',
  className,
}: SectionIntroProps) {
  return (
    <div
      className={cn(
        'flex flex-col',
        align === 'center' ? 'items-center text-center' : 'items-start',
        className
      )}
    >
      <Reveal y={20} duration={0.8}>
        <span className="eyebrow text-gold-deep">{eyebrow}</span>
      </Reveal>

      <RevealHeading
        as={as}
        className={cn(
          'mt-6 text-balance font-display text-display font-medium text-ink',
          align === 'center' ? 'max-w-4xl' : 'max-w-3xl'
        )}
      >
        {heading}
      </RevealHeading>

      {lead && (
        <Reveal
          y={24}
          delay={0.1}
          className={cn(
            'mt-6 text-lg leading-relaxed text-ink-soft',
            align === 'center' ? 'max-w-2xl' : 'max-w-xl'
          )}
        >
          {lead}
        </Reveal>
      )}
    </div>
  )
}

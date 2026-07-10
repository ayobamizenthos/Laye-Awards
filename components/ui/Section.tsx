import { cn } from '@/lib/utils'

interface SectionProps {
  children: React.ReactNode
  id?: string
  className?: string
  spacing?: 'sm' | 'lg' | 'none'
}

const spacingStyles = {
  sm: 'py-10 sm:py-14 lg:py-20',
  lg: 'py-12 sm:py-16 lg:py-24',
  none: '',
} as const

/** A page section with the site's vertical rhythm. */
export function Section({ children, id, className, spacing = 'lg' }: SectionProps) {
  return (
    <section id={id} className={cn(spacingStyles[spacing], className)}>
      {children}
    </section>
  )
}

export function Container({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('mx-auto w-full max-w-[120rem] px-5 sm:px-8 lg:px-12', className)}>
      {children}
    </div>
  )
}

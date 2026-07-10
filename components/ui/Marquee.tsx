import { cn } from '@/lib/utils'

interface MarqueeProps {
  children: React.ReactNode
  direction?: 'ltr' | 'rtl'
  className?: string
}

export function Marquee({ children, direction = 'ltr', className }: MarqueeProps) {
  return (
    <div className={cn('marquee-group overflow-hidden', className)}>
      <div className={cn('marquee-track', direction === 'ltr' ? 'marquee-ltr' : 'marquee-rtl')}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}

import { cn } from '@/lib/utils'

interface CategoryBadgeProps {
  children: React.ReactNode
  variant?: 'solid' | 'outline'
  className?: string
}

export function CategoryBadge({ children, variant = 'solid', className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] leading-none',
        variant === 'solid'
          ? 'bg-royal text-white'
          : 'text-royal-light ring-1 ring-inset ring-royal-light/40',
        className
      )}
    >
      {children}
    </span>
  )
}

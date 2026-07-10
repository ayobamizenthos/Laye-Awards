'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface ConsoleNavProps {
  items: ReadonlyArray<{ href: string; label: string }>
}

export function ConsoleNav({ items }: ConsoleNavProps) {
  const pathname = usePathname()

  return (
    <nav className="mt-9 -mx-1 flex gap-x-7 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mt-12 lg:gap-x-10">
      {items.map(item => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            data-cursor-hover
            className="group/console relative shrink-0 px-1 pb-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em]"
          >
            <span
              className={cn(
                'transition-colors duration-300',
                isActive ? 'text-ink' : 'text-ink-faint group-hover/console:text-ink-soft'
              )}
            >
              {item.label}
            </span>
            <span
              className={cn(
                'absolute -bottom-px left-0 h-px w-full bg-gold transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                isActive
                  ? 'origin-left scale-x-100'
                  : 'origin-right scale-x-0 group-hover/console:origin-left group-hover/console:scale-x-100'
              )}
            />
          </Link>
        )
      })}
    </nav>
  )
}

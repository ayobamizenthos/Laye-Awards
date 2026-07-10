'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP, EDITORIAL_EASE, prefersReducedMotion } from '@/lib/gsap'
import { cn } from '@/lib/utils'

interface StaggerRevealProps {
  children: ReactNode
  className?: string
  stagger?: number
  y?: number
  start?: string
}

export function StaggerReveal({
  children,
  className,
  stagger = 0.1,
  y = 60,
  start = 'top 82%',
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const items = el.querySelectorAll<HTMLElement>('[data-stagger-item]')
      if (items.length === 0) return

      if (prefersReducedMotion()) {
        gsap.set(items, { opacity: 1, y: 0 })
        return
      }

      gsap.fromTo(
        items,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.95,
          ease: EDITORIAL_EASE,
          stagger,
          scrollTrigger: { trigger: el, start },
        }
      )
    },
    { scope: ref }
  )

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div data-stagger-item className={cn('will-reveal', className)}>
      {children}
    </div>
  )
}

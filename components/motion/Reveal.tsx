'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP, EDITORIAL_EASE, prefersReducedMotion } from '@/lib/gsap'
import { cn } from '@/lib/utils'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  duration?: number
  start?: string
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 44,
  duration = 1,
  start = 'top 86%',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      if (prefersReducedMotion()) {
        gsap.set(el, { opacity: 1, y: 0 })
        return
      }

      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: EDITORIAL_EASE,
          scrollTrigger: { trigger: el, start },
        }
      )
    },
    { scope: ref }
  )

  return (
    <div ref={ref} className={cn('will-reveal', className)}>
      {children}
    </div>
  )
}

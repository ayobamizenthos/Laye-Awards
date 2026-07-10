'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { cn } from '@/lib/utils'

interface MagneticProps {
  children: ReactNode
  className?: string
  strength?: number
}

export function Magnetic({ children, className, strength = 0.32 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion()) return

      const xTo = gsap.quickTo(el, 'x', {
        duration: 0.7,
        ease: 'elastic.out(1, 0.45)',
      })
      const yTo = gsap.quickTo(el, 'y', {
        duration: 0.7,
        ease: 'elastic.out(1, 0.45)',
      })

      const handleMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect()
        xTo((event.clientX - (rect.left + rect.width / 2)) * strength)
        yTo((event.clientY - (rect.top + rect.height / 2)) * strength)
      }
      const handleLeave = () => {
        xTo(0)
        yTo(0)
      }

      el.addEventListener('pointermove', handleMove)
      el.addEventListener('pointerleave', handleLeave)
      return () => {
        el.removeEventListener('pointermove', handleMove)
        el.removeEventListener('pointerleave', handleLeave)
      }
    },
    { scope: ref }
  )

  return (
    <div ref={ref} className={cn('inline-block', className)}>
      {children}
    </div>
  )
}

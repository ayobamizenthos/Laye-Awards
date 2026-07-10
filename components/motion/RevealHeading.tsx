'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, SplitText, useGSAP, EDITORIAL_EASE, prefersReducedMotion } from '@/lib/gsap'
import { cn } from '@/lib/utils'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'p'

interface RevealHeadingProps {
  children: ReactNode
  as?: HeadingTag
  className?: string
  delay?: number
  start?: string
  stagger?: number
}

export function RevealHeading({
  children,
  as: Tag = 'h2',
  className,
  delay = 0,
  start = 'top 85%',
  stagger = 0.11,
}: RevealHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      if (prefersReducedMotion()) {
        gsap.set(el, { opacity: 1 })
        return
      }

      gsap.set(el, { opacity: 1 })

      const split = SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit: self =>
          gsap.from(self.lines, {
            yPercent: 115,
            duration: 1.15,
            ease: EDITORIAL_EASE,
            stagger,
            delay,
            scrollTrigger: { trigger: el, start },
          }),
      })

      return () => split.revert()
    },
    { scope: ref }
  )

  return (
    <Tag ref={ref} className={cn('will-reveal', className)}>
      {children}
    </Tag>
  )
}

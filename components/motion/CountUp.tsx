'use client'

import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'

interface CountUpProps {
  value: number
  prefix?: string
  suffix?: string
  className?: string
  duration?: number
}

export function CountUp({
  value,
  prefix = '',
  suffix = '',
  className,
  duration = 2.1,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const render = (n: number) => `${prefix}${Math.round(n).toLocaleString('en-NG')}${suffix}`

      if (prefersReducedMotion()) {
        el.textContent = render(value)
        return
      }

      const counter = { current: 0 }
      el.textContent = render(0)

      gsap.to(counter, {
        current: value,
        duration,
        ease: 'power2.out',
        snap: { current: 1 },
        onUpdate: () => {
          el.textContent = render(counter.current)
        },
        scrollTrigger: { trigger: el, start: 'top 90%' },
      })
    },
    { scope: ref, dependencies: [value] }
  )

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString('en-NG')}
      {suffix}
    </span>
  )
}

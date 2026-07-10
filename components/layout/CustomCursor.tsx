'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

const INTERACTIVE = 'a, button, input, textarea, select, [data-cursor-hover]'

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const ring = ringRef.current
    if (!finePointer || !ring) return

    gsap.set(ring, { xPercent: -50, yPercent: -50, autoAlpha: 0 })

    const moveX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3.out' })
    const moveY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3.out' })

    let revealed = false
    const handleMove = (event: PointerEvent) => {
      if (!revealed) {
        revealed = true
        gsap.to(ring, { autoAlpha: 1, duration: 0.3 })
      }
      moveX(event.clientX)
      moveY(event.clientY)
    }

    const swell = () =>
      gsap.to(ring, {
        scale: 1.9,
        borderColor: 'rgba(201,168,76,0.95)',
        backgroundColor: 'rgba(201,168,76,0.12)',
        duration: 0.4,
        ease: 'power3.out',
      })
    const settle = () =>
      gsap.to(ring, {
        scale: 1,
        borderColor: 'rgba(201,168,76,0.55)',
        backgroundColor: 'rgba(201,168,76,0)',
        duration: 0.4,
        ease: 'power3.out',
      })

    const handleOver = (event: PointerEvent) => {
      if ((event.target as Element)?.closest?.(INTERACTIVE)) swell()
    }
    const handleOut = (event: PointerEvent) => {
      if ((event.target as Element)?.closest?.(INTERACTIVE)) settle()
    }
    const handleLeave = () => gsap.to(ring, { autoAlpha: 0, duration: 0.25 })

    window.addEventListener('pointermove', handleMove)
    document.addEventListener('pointerover', handleOver)
    document.addEventListener('pointerout', handleOut)
    document.documentElement.addEventListener('pointerleave', handleLeave)

    return () => {
      window.removeEventListener('pointermove', handleMove)
      document.removeEventListener('pointerover', handleOver)
      document.removeEventListener('pointerout', handleOut)
      document.documentElement.removeEventListener('pointerleave', handleLeave)
    }
  }, [])

  return (
    <div
      ref={ringRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden size-8 rounded-full border border-gold/55 md:block"
    />
  )
}

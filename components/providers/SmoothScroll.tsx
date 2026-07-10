'use client'

import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'

interface SmoothScrollApi {
  scrollTo: (target: string | number | HTMLElement, offset?: number) => void
  stop: () => void
  start: () => void
}

const nativeScrollTo = (target: string | number | HTMLElement, offset = 0) => {
  if (typeof target === 'string') {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target + offset, behavior: 'smooth' })
  } else {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}

const SmoothScrollContext = createContext<SmoothScrollApi | null>(null)

export function useSmoothScroll(): SmoothScrollApi {
  const ctx = useContext(SmoothScrollContext)
  return (
    ctx ?? {
      scrollTo: nativeScrollTo,
      stop: () => {
        document.body.style.overflow = 'hidden'
      },
      start: () => {
        document.body.style.overflow = ''
      },
    }
  )
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()

  // On every route change, jump to the top and re-measure all ScrollTriggers
  // once the new page has painted, otherwise reveals lower down (the footer)
  // keep stale positions and never fire.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 220)
    return () => window.clearTimeout(id)
  }, [pathname])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  const api: SmoothScrollApi = {
    scrollTo: (target, offset = 0) => {
      const lenis = lenisRef.current
      if (lenis) {
        lenis.scrollTo(target, { offset, duration: 1.4 })
      } else {
        nativeScrollTo(target, offset)
      }
    },
    stop: () => {
      const lenis = lenisRef.current
      if (lenis) lenis.stop()
      else document.body.style.overflow = 'hidden'
    },
    start: () => {
      const lenis = lenisRef.current
      if (lenis) lenis.start()
      else document.body.style.overflow = ''
    },
  }

  return <SmoothScrollContext.Provider value={api}>{children}</SmoothScrollContext.Provider>
}

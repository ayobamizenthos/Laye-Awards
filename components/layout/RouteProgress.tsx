'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const FADE_MS = 320

export function RouteProgress() {
  const pathname = usePathname()
  const params = useSearchParams()
  const [active, setActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastKey = useRef<string | null>(null)
  const stepTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const anchor = target?.closest('a') as HTMLAnchorElement | null
      if (!anchor) return
      if (anchor.hasAttribute('download')) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return
      }
      const opensNewTab = anchor.target === '_blank'
      try {
        const url = new URL(anchor.href, window.location.href)
        const sameOrigin = url.origin === window.location.origin
        if (!sameOrigin && !opensNewTab) return
        if (
          sameOrigin &&
          url.pathname === window.location.pathname &&
          url.search === window.location.search
        ) {
          return
        }
      } catch {
        return
      }
      start()
      if (opensNewTab) {
        window.setTimeout(finish, 900)
      }
    }
    const onSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement | null
      if (!form) return
      start()
      window.setTimeout(finish, 6000)
    }
    document.addEventListener('click', onClick, { capture: true })
    document.addEventListener('submit', onSubmit, { capture: true })
    return () => {
      document.removeEventListener('click', onClick, { capture: true })
      document.removeEventListener('submit', onSubmit, { capture: true })
    }
  }, [])

  useEffect(() => {
    const key = `${pathname}?${params?.toString() ?? ''}`
    if (lastKey.current !== null && lastKey.current !== key) {
      finish()
    }
    lastKey.current = key
  }, [pathname, params])

  function start() {
    if (finishTimer.current) {
      clearTimeout(finishTimer.current)
      finishTimer.current = null
    }
    setActive(true)
    setProgress(8)
    if (stepTimer.current) clearInterval(stepTimer.current)
    stepTimer.current = setInterval(() => {
      setProgress(current => {
        if (current >= 90) return current
        const delta = current < 30 ? 8 : current < 60 ? 4 : current < 80 ? 2 : 1
        return Math.min(90, current + delta)
      })
    }, 220)
  }

  function finish() {
    if (stepTimer.current) {
      clearInterval(stepTimer.current)
      stepTimer.current = null
    }
    setProgress(100)
    finishTimer.current = setTimeout(() => {
      setActive(false)
      setProgress(0)
    }, FADE_MS)
  }

  if (!active && progress === 0) return null

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: active ? 1 : 0,
        transition: `opacity ${FADE_MS}ms ease`,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background:
            'linear-gradient(90deg, transparent, #cba94e 40%, #f1d588 65%, #cba94e 90%, transparent)',
          boxShadow: '0 0 12px rgba(203,169,78,0.6)',
          transition: 'width 220ms ease',
        }}
      />
    </div>
  )
}

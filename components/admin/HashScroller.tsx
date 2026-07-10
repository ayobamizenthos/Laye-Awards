'use client'

import { useEffect } from 'react'

export function HashScroller() {
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash.replace('#', '')
      if (!hash) return
      const node = document.getElementById(hash)
      if (!node) return
      node.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const timer = window.setTimeout(scrollToHash, 80)
    window.addEventListener('hashchange', scrollToHash)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('hashchange', scrollToHash)
    }
  }, [])

  return null
}

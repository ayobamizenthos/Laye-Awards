'use client'

import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, Printer } from 'lucide-react'

const PRINT_TITLE = 'Layeawards_applications'

export function ExportToolbar() {
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const previous = document.title
    document.title = PRINT_TITLE
    return () => {
      document.title = previous
    }
  }, [])

  const handlePrint = useCallback(async () => {
    const report = document.querySelector('.report-root')
    if (!report || busy) return
    setBusy(true)

    const images = Array.from(report.querySelectorAll('img'))
    await Promise.all(
      images.map(img =>
        img.complete && img.naturalWidth > 0
          ? Promise.resolve()
          : new Promise<void>(resolve => {
              img.addEventListener('load', () => resolve(), { once: true })
              img.addEventListener('error', () => resolve(), { once: true })
            })
      )
    )

    const existing = document.getElementById('print-portal')
    if (existing) existing.remove()

    const portal = document.createElement('div')
    portal.id = 'print-portal'
    portal.appendChild(report.cloneNode(true))
    document.body.appendChild(portal)

    const previousTitle = document.title
    document.title = PRINT_TITLE
    document.body.classList.add('is-printing')

    const cleanup = () => {
      document.body.classList.remove('is-printing')
      portal.remove()
      document.title = previousTitle
      setBusy(false)
    }

    const afterPrint = () => {
      window.removeEventListener('afterprint', afterPrint)
      cleanup()
    }
    window.addEventListener('afterprint', afterPrint)

    window.setTimeout(() => {
      window.print()
      window.setTimeout(cleanup, 2000)
    }, 60)
  }, [busy])

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 bg-white/95 px-6 py-3 backdrop-blur sm:px-10 print:hidden">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors duration-200 hover:bg-stone-100"
      >
        <ArrowLeft className="size-3.5" strokeWidth={1.75} />
        Back
      </button>
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-stone-500">
        Applications report
      </p>
      <button
        type="button"
        onClick={handlePrint}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white transition-transform duration-200 hover:scale-[1.02] disabled:opacity-50"
      >
        <Printer className="size-3.5" strokeWidth={1.75} />
        {busy ? 'Preparing…' : 'Print / Save PDF'}
      </button>
    </div>
  )
}

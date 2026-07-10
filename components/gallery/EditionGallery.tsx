'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react'

export function EditionGallery({ photos, label }: { photos: string[]; label: string }) {
  const [active, setActive] = useState<number | null>(null)

  const close = useCallback(() => setActive(null), [])
  const step = useCallback(
    (delta: number) =>
      setActive(current =>
        current === null ? current : (current + delta + photos.length) % photos.length
      ),
    [photos.length]
  )

  useEffect(() => {
    if (active === null) return
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [active, close, step])

  if (photos.length === 0) return null

  return (
    <>
      <div className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4 [&>*]:mb-3 sm:[&>*]:mb-4">
        {photos.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => setActive(index)}
            data-cursor-hover
            aria-label={`Open photo ${index + 1}`}
            className="group/ph relative block w-full overflow-hidden rounded-2xl border border-gold/20 shadow-[0_18px_44px_-30px_rgba(0,0,0,0.4)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-gold/55 hover:shadow-[0_28px_60px_-30px_rgba(151,116,42,0.45)]"
          >
            <Image
              src={src}
              alt={`${label} photo ${index + 1}`}
              width={700}
              height={500}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="h-auto w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/ph:scale-[1.05]"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-onyx/0 opacity-0 transition-all duration-300 group-hover/ph:bg-onyx/25 group-hover/ph:opacity-100">
              <span className="flex size-11 items-center justify-center rounded-full bg-onyx/70 text-white backdrop-blur-sm">
                <Expand className="size-4" strokeWidth={1.75} />
              </span>
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            className="fixed inset-0 z-[95] flex items-center justify-center bg-onyx/96 p-4 backdrop-blur-sm sm:p-10"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="absolute right-5 top-5 flex size-12 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white"
            >
              <X className="size-6" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Previous"
              onClick={event => {
                event.stopPropagation()
                step(-1)
              }}
              className="absolute left-3 flex size-12 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white sm:left-8"
            >
              <ChevronLeft className="size-7" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={event => {
                event.stopPropagation()
                step(1)
              }}
              className="absolute right-3 flex size-12 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white sm:right-8"
            >
              <ChevronRight className="size-7" strokeWidth={1.5} />
            </button>
            <motion.div
              key={photos[active]}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={event => event.stopPropagation()}
              className="relative flex max-h-[82vh] max-w-5xl items-center"
            >
              <Image
                src={photos[active]}
                alt={`${label} photo ${active + 1}`}
                width={1400}
                height={1000}
                className="max-h-[82vh] w-auto rounded-xl object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

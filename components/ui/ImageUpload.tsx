'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { ImagePlus, Upload, X } from 'lucide-react'
import { createImageUploadTicket } from '@/lib/supabase/uploads'

interface ImageUploadProps {
  label: string
  value: string
  onChange: (url: string) => void
  helper?: string
  required?: boolean
  className?: string
}

const MAX_EDGE = 1600
const COMPRESS_ABOVE_BYTES = 500 * 1024
const SHRINK_TIMEOUT_MS = 8000
const UPLOAD_TIMEOUT_MS = 90000

/**
 * Resolves to `fallback()` if the promise hasn't settled in time. Nothing in the
 * upload path is allowed to hang the button indefinitely — every step either
 * succeeds, fails with a message, or falls back within a bounded window.
 */
function withTimeout<T>(promise: Promise<T>, ms: number, fallback: () => T): Promise<T> {
  return new Promise<T>(resolve => {
    let settled = false
    const finish = (value: T) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      resolve(value)
    }
    const timer = setTimeout(() => finish(fallback()), ms)
    promise.then(finish).catch(() => finish(fallback()))
  })
}

function decodeImage(file: File): Promise<HTMLImageElement | null> {
  return new Promise(resolve => {
    const url = URL.createObjectURL(file)
    const image = new window.Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(null)
    }
    image.src = url
  })
}

/**
 * Phone photos routinely run 3-8 MB. Shrinking them in the browser keeps the
 * upload quick on mobile data. Decoding uses a plain <img> element, which is
 * supported everywhere and — unlike createImageBitmap — never hangs on large or
 * HEIC-derived files. Any failure falls back to the original file.
 */
async function compressForUpload(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.size < COMPRESS_ABOVE_BYTES) return file
  const image = await decodeImage(file)
  if (!image || !image.naturalWidth || !image.naturalHeight) return file

  const scale = Math.min(1, MAX_EDGE / Math.max(image.naturalWidth, image.naturalHeight))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
  const context = canvas.getContext('2d')
  if (!context) return file
  context.drawImage(image, 0, 0, canvas.width, canvas.height)

  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.82))
  if (!blob || blob.size >= file.size) return file
  return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' })
}

export function ImageUpload({
  label,
  value,
  onChange,
  helper,
  required,
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setError(null)
    setIsUploading(true)
    try {
      const prepared = await withTimeout(compressForUpload(file), SHRINK_TIMEOUT_MS, () => file)

      const ticket = await createImageUploadTicket(prepared.name, prepared.type, prepared.size)
      if (!ticket.ok) {
        setError(ticket.error)
        return
      }

      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS)
      try {
        const response = await fetch(ticket.signedUrl, {
          method: 'PUT',
          headers: { 'content-type': prepared.type, 'x-upsert': 'false' },
          body: prepared,
          signal: controller.signal,
        })
        if (!response.ok) {
          setError('Upload failed. Please try again.')
          return
        }
      } catch {
        setError('Upload timed out. Check your connection and try again.')
        return
      } finally {
        clearTimeout(timer)
      }

      onChange(ticket.url)
    } catch {
      setError('Upload failed. Check your connection and try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={className}>
      <span className="mb-2.5 block text-[0.95rem] font-medium text-ink">{label}</span>

      <div className="flex items-start gap-5">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-xl border border-hairline bg-surface sm:size-28">
          {value ? (
            <Image
              src={value}
              alt="Preview"
              fill
              sizes="(max-width: 640px) 96px, 112px"
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-ink-faint">
              <ImagePlus className="size-7" strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2.5">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFile}
            className="sr-only"
            disabled={isUploading}
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink transition-transform duration-200 hover:scale-[1.02] disabled:cursor-wait disabled:opacity-70"
            >
              <Upload className="size-3.5" strokeWidth={2} />
              {isUploading ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
            </button>
            {value && !isUploading && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-red-300"
              >
                <X className="size-3" strokeWidth={2} />
                Remove
              </button>
            )}
          </div>

          {required && !value && !error && !helper && (
            <p className="text-xs leading-relaxed text-ink-faint">
              A clear photo or logo is required.
            </p>
          )}
          {helper && !error && <p className="text-xs leading-relaxed text-ink-faint">{helper}</p>}
          {error && (
            <p role="alert" className="text-xs leading-relaxed text-red-300">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

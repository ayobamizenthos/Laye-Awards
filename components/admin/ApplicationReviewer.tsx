'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import {
  approveApplicationAction,
  deleteApplicationAction,
  rejectApplicationAction,
} from '@/lib/supabase/admin'
import { Button } from '@/components/ui/Button'
import { ImageUpload } from '@/components/ui/ImageUpload'

interface Props {
  applicationId: string
  defaultHeadline: string
  defaultBio: string
  defaultPhotoUrl?: string
}

export function ApplicationReviewer({
  applicationId,
  defaultHeadline,
  defaultBio,
  defaultPhotoUrl = '',
}: Props) {
  const router = useRouter()
  const [mode, setMode] = useState<'idle' | 'approve' | 'reject' | 'delete'>('idle')
  const [photoUrl, setPhotoUrl] = useState(defaultPhotoUrl)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleApprove = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    if (!photoUrl) {
      setError('Upload a photo before publishing.')
      return
    }
    const formData = new FormData(event.currentTarget)
    startTransition(async () => {
      const result = await approveApplicationAction(applicationId, formData)
      if (!result.ok) setError(result.error)
    })
  }

  const handleReject = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    const formData = new FormData(event.currentTarget)
    startTransition(async () => {
      const result = await rejectApplicationAction(applicationId, formData)
      if (!result.ok) setError(result.error)
    })
  }

  const handleDelete = () => {
    setError(null)
    startTransition(async () => {
      const result = await deleteApplicationAction(applicationId)
      if (!result.ok) {
        setError(result.error)
        return
      }
      router.refresh()
    })
  }

  if (mode === 'idle') {
    return (
      <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:mt-8 sm:gap-3">
        <Button onClick={() => setMode('approve')} magnetic={false} size="sm" withArrow>
          Publish as Nominee
        </Button>
        <button
          type="button"
          onClick={() => setMode('reject')}
          className="rounded-full border border-hairline px-4 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-ink-soft transition-colors duration-200 hover:border-red-500/40 hover:text-red-300 sm:px-5 sm:py-2.5 sm:text-xs"
        >
          Reject
        </button>
        <button
          type="button"
          onClick={() => setMode('delete')}
          className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-3.5 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-ink-faint transition-colors duration-200 hover:border-red-500/40 hover:text-red-300 sm:px-4 sm:py-2.5 sm:text-xs"
        >
          <Trash2 className="size-3.5" strokeWidth={1.75} />
          Delete
        </button>
      </div>
    )
  }

  if (mode === 'delete') {
    return (
      <div className="mt-8 flex flex-wrap items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/[0.05] p-5">
        <p className="text-sm text-red-100">
          Delete this submission permanently? Nothing recoverable.
        </p>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="rounded-full bg-red-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-red-100 transition-colors hover:bg-red-500/30 disabled:opacity-60"
        >
          {isPending ? 'Deleting…' : 'Yes, delete'}
        </button>
        <button
          type="button"
          onClick={() => setMode('idle')}
          className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint hover:text-ink-soft"
        >
          Cancel
        </button>
        {error && <p className="text-xs text-red-300">{error}</p>}
      </div>
    )
  }

  if (mode === 'approve') {
    return (
      <form
        onSubmit={handleApprove}
        className="mt-6 space-y-5 rounded-2xl border border-gold/30 bg-gold/[0.05] p-4 sm:mt-8 sm:space-y-6 sm:p-6 lg:p-8"
      >
        <div>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-gold-deep sm:text-[0.7rem] sm:tracking-[0.18em]">
            Publish nominee
          </p>
          <h4 className="mt-1.5 font-display text-lg text-ink sm:mt-2 sm:text-2xl">
            Add a photo, a tagline, and a statement.
          </h4>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-soft sm:mt-2 sm:text-sm">
            This is what voters will see on the nominee’s public page. Tagline and statement are
            pre-filled from their submission. Adjust them however you like.
          </p>
        </div>

        <ImageUpload
          label="Photo"
          required
          value={photoUrl}
          onChange={setPhotoUrl}
          helper="A clean headshot or business logo. JPG, PNG, WEBP or AVIF. Up to 5 MB."
        />
        <input type="hidden" name="headshotUrl" value={photoUrl} aria-hidden="true" />

        <Field
          label="Short tagline"
          name="headline"
          required
          defaultValue={defaultHeadline}
          placeholder="One line that appears under their name on the public page"
        />
        <Field
          label="Industry"
          name="industry"
          placeholder="FinTech, Beauty, Hospitality (optional)"
        />
        <Field
          label="Statement"
          name="bio"
          textarea
          required
          defaultValue={defaultBio}
          rows={5}
          placeholder="2 to 3 sentences. Who they are, what they've built, why it matters."
        />

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-500/30 bg-red-500/[0.07] px-3 py-2 text-xs text-red-200"
          >
            {error}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4 border-t border-gold/20 pt-5">
          <Button type="submit" disabled={isPending} magnetic={false} withArrow>
            {isPending ? 'Publishing…' : 'Approve & Publish'}
          </Button>
          <button
            type="button"
            onClick={() => setMode('idle')}
            className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-ink-soft"
          >
            Cancel
          </button>
        </div>
      </form>
    )
  }

  return (
    <form
      onSubmit={handleReject}
      className="mt-6 space-y-4 rounded-xl border border-red-500/30 bg-red-500/[0.04] p-5"
    >
      <Field
        label="Note to applicant (optional)"
        name="notes"
        textarea
        rows={3}
        placeholder="They will see this on their dashboard."
      />
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/30 bg-red-500/[0.07] px-3 py-2 text-xs text-red-200"
        >
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isPending} magnetic={false}>
          {isPending ? 'Saving…' : 'Confirm Reject'}
        </Button>
        <button
          type="button"
          onClick={() => setMode('idle')}
          className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

interface FieldProps {
  label: string
  name: string
  required?: boolean
  placeholder?: string
  defaultValue?: string
  textarea?: boolean
  rows?: number
}

function Field({ label, name, required, placeholder, defaultValue, textarea, rows }: FieldProps) {
  const baseClass =
    'w-full rounded-lg border border-hairline bg-canvas px-4 text-sm text-ink outline-none transition-colors duration-200 placeholder:text-ink-faint focus:border-gold'
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
        {label}
      </span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          rows={rows ?? 4}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={`${baseClass} resize-none py-2.5 leading-relaxed`}
        />
      ) : (
        <input
          name={name}
          required={required}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={`${baseClass} h-11`}
        />
      )}
    </label>
  )
}

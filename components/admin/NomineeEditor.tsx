'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import {
  deleteNomineeAction,
  toggleNomineePublishedAction,
  updateNomineeAction,
} from '@/lib/supabase/admin'
import { Button } from '@/components/ui/Button'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { cn } from '@/lib/utils'

interface Defaults {
  fullName: string
  businessName: string
  industry: string
  headline: string
  bio: string
  headshotUrl: string
  isPublished: boolean
}

interface Props {
  nomineeId: string
  slug: string
  defaults: Defaults
}

export function NomineeEditor({ nomineeId, slug, defaults }: Props) {
  const router = useRouter()
  const [form, setForm] = useState(defaults)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const update =
    <K extends keyof Defaults>(key: K) =>
    (value: Defaults[K]) =>
      setForm(current => ({ ...current, [key]: value }))

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setNotice(null)
    startTransition(async () => {
      const result = await updateNomineeAction(nomineeId, form)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setNotice('Nominee saved.')
      router.refresh()
    })
  }

  const handleTogglePublished = () => {
    setError(null)
    setNotice(null)
    const next = !form.isPublished
    startTransition(async () => {
      const result = await toggleNomineePublishedAction(nomineeId, next)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setForm(current => ({ ...current, isPublished: next }))
      setNotice(next ? 'Nominee is now public.' : 'Nominee hidden from the public ballot.')
      router.refresh()
    })
  }

  const handleDelete = () => {
    setError(null)
    setNotice(null)
    startTransition(async () => {
      const result = await deleteNomineeAction(nomineeId)
      if (!result.ok) {
        setError(result.error)
        return
      }
      router.push('/admin/nominees')
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSave} className="space-y-7">
      <ImageUpload
        label="Photo"
        required
        value={form.headshotUrl}
        onChange={update('headshotUrl')}
        helper="Headshot or business logo. JPG, PNG, WEBP or AVIF up to 5 MB."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <EditorField
          label="Full name"
          required
          value={form.fullName}
          onChange={update('fullName')}
        />
        <EditorField
          label="Business name"
          required
          value={form.businessName}
          onChange={update('businessName')}
        />
        <div className="lg:col-span-2">
          <EditorField
            label="Industry"
            value={form.industry}
            onChange={update('industry')}
            placeholder="FinTech, Beauty, Hospitality (optional)"
          />
        </div>
      </div>

      <EditorField
        label="Short tagline"
        required
        value={form.headline}
        onChange={update('headline')}
        placeholder="One line that appears under their name on the public page."
      />
      <EditorField
        label="Statement"
        required
        textarea
        rows={6}
        value={form.bio}
        onChange={update('bio')}
        placeholder="Two to four sentences. Mention the founder's story, scale, impact."
      />

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-hairline bg-surface p-6">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            Visibility
          </p>
          <p className="mt-2 font-display text-xl text-ink">
            {form.isPublished ? 'Live on the public ballot' : 'Hidden from the public ballot'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleTogglePublished}
          disabled={isPending}
          aria-pressed={form.isPublished}
          aria-label={form.isPublished ? 'Hide nominee' : 'Publish nominee'}
          className={cn(
            'relative inline-flex h-9 w-16 items-center rounded-full transition-colors duration-300',
            form.isPublished ? 'bg-gold' : 'bg-hairline'
          )}
        >
          <span
            className={cn(
              'inline-block size-7 transform rounded-full bg-canvas shadow-sm transition-transform duration-300',
              form.isPublished ? 'translate-x-8' : 'translate-x-1'
            )}
          />
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6">
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" disabled={isPending} magnetic={false} withArrow>
            {isPending ? 'Saving…' : 'Save changes'}
          </Button>
          <a
            href={`/nominees/${slug}`}
            target="_blank"
            rel="noreferrer noopener"
            className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink-faint transition-colors duration-200 hover:text-gold-deep"
          >
            View public page →
          </a>
        </div>

        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink-faint transition-colors duration-200 hover:text-red-300"
          >
            <Trash2 className="size-3.5" strokeWidth={1.75} />
            Delete nominee
          </button>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/[0.05] px-4 py-2.5 text-sm">
            <span className="text-red-200">Delete permanently?</span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-red-100 transition-colors hover:bg-red-500/30"
            >
              Yes, delete
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint hover:text-ink-soft"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {notice && (
        <p
          role="status"
          className="rounded-xl border border-gold/30 bg-gold/[0.07] px-4 py-3 text-sm text-ink-soft"
        >
          {notice}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/[0.07] px-4 py-3 text-sm text-red-200"
        >
          {error}
        </p>
      )}
    </form>
  )
}

function EditorField({
  label,
  value,
  onChange,
  required,
  placeholder,
  helper,
  textarea,
  rows,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  placeholder?: string
  helper?: string
  textarea?: boolean
  rows?: number
}) {
  const baseClass =
    'w-full rounded-xl border border-hairline bg-surface px-4 text-sm text-ink outline-none transition-colors duration-200 placeholder:text-ink-faint focus:border-gold'
  return (
    <label className="block">
      <span className="mb-2 block text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">
        {label}
      </span>
      {textarea ? (
        <textarea
          required={required}
          value={value}
          rows={rows ?? 4}
          placeholder={placeholder}
          onChange={event => onChange(event.target.value)}
          className={`${baseClass} resize-none py-3 leading-relaxed`}
        />
      ) : (
        <input
          required={required}
          value={value}
          placeholder={placeholder}
          onChange={event => onChange(event.target.value)}
          className={`${baseClass} h-12`}
        />
      )}
      {helper && <p className="mt-2 text-xs text-ink-faint">{helper}</p>}
    </label>
  )
}

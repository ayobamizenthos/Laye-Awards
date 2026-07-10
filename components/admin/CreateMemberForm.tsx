'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, X } from 'lucide-react'
import { createMemberAction } from '@/lib/supabase/members'
import { Button } from '@/components/ui/Button'

export function CreateMemberForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    const formData = new FormData(event.currentTarget)
    startTransition(async () => {
      const result = await createMemberAction(formData)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setOpen(false)
      router.refresh()
    })
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} magnetic={false} size="sm">
        <UserPlus className="size-4" strokeWidth={1.75} />
        Create account
      </Button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-4 rounded-2xl border border-gold/30 bg-gold/[0.05] p-5 sm:p-6"
    >
      <div className="flex items-center justify-between">
        <p className="font-display text-lg text-ink sm:text-xl">New account</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Cancel"
          className="text-ink-faint transition-colors hover:text-ink"
        >
          <X className="size-5" strokeWidth={1.75} />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="fullName" required placeholder="Jane Doe" />
        <Field label="Email" name="email" type="email" required placeholder="jane@email.com" />
        <Field
          label="Password"
          name="password"
          type="password"
          required
          placeholder="At least 8 characters"
        />
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
            Role
          </span>
          <select
            name="role"
            defaultValue="applicant"
            className="h-11 w-full rounded-lg border border-hairline bg-canvas px-4 text-sm text-ink outline-none transition-colors focus:border-gold"
          >
            <option value="applicant">Applicant</option>
            <option value="admin">Admin</option>
          </select>
        </label>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/30 bg-red-500/[0.07] px-3 py-2 text-xs text-red-200"
        >
          {error}
        </p>
      )}

      <div className="flex items-center gap-4 pt-1">
        <Button type="submit" disabled={isPending} magnetic={false} size="sm">
          {isPending ? 'Creating…' : 'Create account'}
        </Button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-ink-soft"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete="off"
        className="h-11 w-full rounded-lg border border-hairline bg-canvas px-4 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-gold"
      />
    </label>
  )
}

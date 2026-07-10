'use client'

import { useState, useTransition } from 'react'
import { Check } from 'lucide-react'
import { TextField, TextArea } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { sendContactEnquiryAction } from '@/lib/contact-actions'

const EMPTY = { name: '', email: '', subject: '', message: '' }

export function ContactForm() {
  const [form, setForm] = useState(EMPTY)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const update = (key: keyof typeof EMPTY) => (value: string) =>
    setForm(current => ({ ...current, [key]: value }))

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await sendContactEnquiryAction(form)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setSubmitted(true)
    })
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-hairline bg-surface px-8 py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
          <Check className="size-7" strokeWidth={1.75} />
        </span>
        <h3 className="mt-6 font-display text-3xl font-medium text-ink">Message received.</h3>
        <p className="mt-3 max-w-sm text-ink-soft">
          Thank you. The LAYEAWARDS team will reply to{' '}
          <span className="text-ink">{form.email}</span> as soon as we have read your enquiry.
        </p>
        <button
          type="button"
          onClick={() => {
            setForm(EMPTY)
            setSubmitted(false)
          }}
          data-cursor-hover
          className="mt-6 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-gold-deep transition-colors hover:text-gold"
        >
          Submit another
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-hairline bg-surface p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Full name"
          name="name"
          required
          placeholder="Your name"
          value={form.name}
          onChange={update('name')}
          autoComplete="name"
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          required
          placeholder="you@email.com"
          value={form.email}
          onChange={update('email')}
          autoComplete="email"
        />
      </div>
      <TextField
        label="Subject"
        name="subject"
        required
        placeholder="What is this about?"
        value={form.subject}
        onChange={update('subject')}
        className="mt-5"
      />
      <TextArea
        label="Message"
        name="message"
        required
        rows={6}
        placeholder="Tell us a little more…"
        value={form.message}
        onChange={update('message')}
        className="mt-5"
      />
      <div className="mt-7">
        <Button type="submit" disabled={isPending} magnetic={false} withArrow className="w-full">
          {isPending ? 'Submitting…' : 'Submit'}
        </Button>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-lg border border-red-500/40 bg-red-500/[0.07] px-4 py-3 text-sm leading-relaxed text-red-700"
        >
          {error}
        </p>
      )}
    </form>
  )
}

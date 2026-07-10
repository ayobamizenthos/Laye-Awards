'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { TextField } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { signInAction, signUpAction } from '@/lib/supabase/actions'
import { cn } from '@/lib/utils'

interface AuthFormProps {
  mode: 'login' | 'register'
}

const initialForm = { fullName: '', email: '', phone: '', password: '', confirm: '' }

export function AuthForm({ mode }: AuthFormProps) {
  const isRegister = mode === 'register'
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/dashboard'

  const [form, setForm] = useState(initialForm)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const update = (key: keyof typeof form) => (value: string) =>
    setForm(current => ({ ...current, [key]: value }))

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    const formData = new FormData()
    formData.set('email', form.email)
    formData.set('password', form.password)
    if (isRegister) {
      formData.set('fullName', form.fullName)
      formData.set('phone', form.phone)
      formData.set('confirm', form.confirm)
    }

    startTransition(async () => {
      const result = isRegister ? await signUpAction(formData) : await signInAction(formData)
      if (!result.ok) {
        setError(result.error)
        return
      }
      if (isRegister) {
        setSuccess('Check your inbox to confirm your email, then sign in.')
        setForm(initialForm)
        setAgreed(false)
        return
      }

      window.location.assign(next)
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-hairline bg-surface p-7 sm:p-9"
    >
      <div className="space-y-5">
        {isRegister && (
          <TextField
            label="Full name"
            name="fullName"
            required
            placeholder="Your full name"
            value={form.fullName}
            onChange={update('fullName')}
            autoComplete="name"
          />
        )}
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
        {isRegister && (
          <TextField
            label="Phone"
            name="phone"
            type="tel"
            required
            placeholder="080 0000 0000"
            value={form.phone}
            onChange={update('phone')}
            autoComplete="tel"
          />
        )}
        <TextField
          label="Password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          value={form.password}
          onChange={update('password')}
          autoComplete={isRegister ? 'new-password' : 'current-password'}
        />
        {isRegister && (
          <TextField
            label="Confirm password"
            name="confirm"
            type="password"
            required
            placeholder="••••••••"
            value={form.confirm}
            onChange={update('confirm')}
            autoComplete="new-password"
          />
        )}
      </div>

      {isRegister ? (
        <label className="mt-5 flex cursor-pointer items-start gap-3">
          <button
            type="button"
            role="checkbox"
            aria-checked={agreed ? ('true' as const) : ('false' as const)}
            onClick={() => setAgreed(value => !value)}
            className={cn(
              'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors duration-200',
              agreed ? 'border-gold bg-gold text-ink' : 'border-hairline bg-surface'
            )}
          >
            {agreed && (
              <svg viewBox="0 0 12 12" className="size-3" aria-hidden>
                <path
                  d="M2 6.5l2.5 2.5L10 3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
          <span className="text-sm leading-relaxed text-ink-soft">
            I agree to the LAYEAWARDS terms and eligibility criteria.
          </span>
        </label>
      ) : (
        <div className="mt-4 text-right">
          <Link
            href="/contact"
            className="text-xs font-medium text-ink-soft transition-colors hover:text-gold-deep"
          >
            Forgot password?
          </Link>
        </div>
      )}

      <div className="mt-7">
        <Button
          type="submit"
          magnetic={false}
          withArrow
          disabled={(isRegister && !agreed) || isPending}
          className="w-full"
        >
          {isPending
            ? isRegister
              ? 'Creating…'
              : 'Signing in…'
            : isRegister
              ? 'Create Account'
              : 'Sign In'}
        </Button>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-500/30 bg-red-500/[0.07] px-3.5 py-2.5 text-xs leading-relaxed text-red-200"
        >
          {error}
        </p>
      )}

      {success && (
        <p
          role="status"
          className="mt-4 rounded-lg border border-gold/30 bg-gold/[0.07] px-3.5 py-2.5 text-xs leading-relaxed text-ink-soft"
        >
          {success}
        </p>
      )}

      <p className="mt-6 text-center text-sm text-ink-soft">
        {isRegister ? 'Already have an account?' : 'New to LAYEAWARDS?'}{' '}
        <Link
          href={isRegister ? '/login' : '/register'}
          data-cursor-hover
          className="font-medium text-gold-deep underline-offset-4 hover:underline"
        >
          {isRegister ? 'Sign in' : 'Create an account'}
        </Link>
      </p>
    </form>
  )
}

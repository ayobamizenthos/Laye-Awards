'use client'

import { useState, useTransition } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { signInAction, signUpAction } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface InlineAuthGateProps {
  defaultFullName?: string
  defaultPhone?: string
  defaultEmail?: string
  onSuccess: () => void
}

type Mode = 'signin' | 'signup'

export function InlineAuthGate({
  defaultFullName,
  defaultPhone,
  defaultEmail,
  onSuccess,
}: InlineAuthGateProps) {
  const [mode, setMode] = useState<Mode>('signup')
  const [fullName, setFullName] = useState(defaultFullName ?? '')
  const [email, setEmail] = useState(defaultEmail ?? '')
  const [phone, setPhone] = useState(defaultPhone ?? '')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setInfo(null)

    const formData = new FormData()
    formData.set('email', email.trim())
    formData.set('password', password)
    if (mode === 'signup') {
      formData.set('fullName', fullName.trim())
      formData.set('phone', phone.trim())
      formData.set('confirm', confirm)
      formData.set('redirectTo', '/apply?resume=1')
    }

    startTransition(async () => {
      const result = mode === 'signup' ? await signUpAction(formData) : await signInAction(formData)
      if (!result.ok) {
        setError(result.error)
        return
      }
      if (mode === 'signup' && 'needsConfirmation' in result && result.needsConfirmation) {
        setInfo(
          'Check your inbox and tap the confirmation link. You will land back here and your application will submit automatically, with no need to refill anything.'
        )
        setMode('signin')
        setPassword('')
        setConfirm('')
        return
      }
      onSuccess()
    })
  }

  return (
    <div className="rounded-2xl border border-gold/35 bg-gradient-to-b from-gold/[0.07] to-transparent p-6 lg:p-8">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-gold-deep">
        Almost there
      </p>
      <h3 className="mt-3 font-display text-3xl font-medium text-ink lg:text-4xl">
        Sign in to submit your entry.
      </h3>
      <p className="mt-3 text-ink-soft">
        Your application stays on this page. Create an account or sign in, and your answers go in
        with one click.
      </p>

      <div className="mt-7 inline-flex rounded-full border border-hairline p-1">
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={cn(
            'rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-200',
            mode === 'signup' ? 'bg-ink text-canvas' : 'text-ink-soft hover:text-ink'
          )}
        >
          Create account
        </button>
        <button
          type="button"
          onClick={() => setMode('signin')}
          className={cn(
            'rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-200',
            mode === 'signin' ? 'bg-ink text-canvas' : 'text-ink-soft hover:text-ink'
          )}
        >
          Sign in
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {mode === 'signup' && (
          <GateField
            label="Full name"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={setFullName}
          />
        )}
        <GateField
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={setEmail}
          placeholder="you@email.com"
        />
        {mode === 'signup' && (
          <GateField
            label="Phone"
            type="tel"
            autoComplete="tel"
            required
            value={phone}
            onChange={setPhone}
            placeholder="080 0000 0000"
          />
        )}

        <PasswordField
          label="Password"
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          required
          value={password}
          onChange={setPassword}
          revealed={revealed}
          onToggleReveal={() => setRevealed(v => !v)}
        />
        {mode === 'signup' && (
          <PasswordField
            label="Confirm password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={setConfirm}
            revealed={revealed}
            onToggleReveal={() => setRevealed(v => !v)}
          />
        )}

        <div className="pt-2">
          <Button type="submit" disabled={isPending} magnetic={false} withArrow className="w-full">
            {isPending
              ? mode === 'signup'
                ? 'Creating account…'
                : 'Signing in…'
              : mode === 'signup'
                ? 'Create Account'
                : 'Sign In & Submit'}
          </Button>
        </div>

        {info && (
          <p
            role="status"
            className="rounded-lg border border-gold/30 bg-gold/[0.07] px-3.5 py-2.5 text-xs leading-relaxed text-ink-soft"
          >
            {info}
          </p>
        )}
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-500/30 bg-red-500/[0.07] px-3.5 py-2.5 text-xs leading-relaxed text-red-200"
          >
            {error}
          </p>
        )}
      </form>
    </div>
  )
}

interface FieldShellProps {
  label: string
  required?: boolean
}

function FieldLabel({ label, required }: FieldShellProps) {
  return (
    <span className="mb-2 block text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">
      {label}
    </span>
  )
}

const inputShell =
  'h-12 w-full rounded-xl border border-hairline bg-surface px-4 text-sm text-ink outline-none transition-colors duration-200 placeholder:text-ink-faint focus:border-gold'

function GateField({
  label,
  type,
  required,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string
  type: 'text' | 'email' | 'tel'
  required?: boolean
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoComplete?: string
}) {
  return (
    <label className="block">
      <FieldLabel label={label} required={required} />
      <input
        type={type}
        required={required}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={inputShell}
      />
    </label>
  )
}

function PasswordField({
  label,
  required,
  value,
  onChange,
  autoComplete,
  revealed,
  onToggleReveal,
}: {
  label: string
  required?: boolean
  value: string
  onChange: (value: string) => void
  autoComplete: string
  revealed: boolean
  onToggleReveal: () => void
}) {
  return (
    <label className="block">
      <FieldLabel label={label} required={required} />
      <div className="relative">
        <input
          type={revealed ? 'text' : 'password'}
          required={required}
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder="••••••••"
          autoComplete={autoComplete}
          className={`${inputShell} pr-12`}
        />
        <button
          type="button"
          aria-label={revealed ? 'Hide password' : 'Show password'}
          aria-pressed={revealed ? 'true' : 'false'}
          onClick={onToggleReveal}
          tabIndex={-1}
          className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-ink-faint transition-colors duration-200 hover:bg-canvas hover:text-ink-soft"
        >
          {revealed ? (
            <EyeOff className="size-4" strokeWidth={1.75} />
          ) : (
            <Eye className="size-4" strokeWidth={1.75} />
          )}
        </button>
      </div>
    </label>
  )
}

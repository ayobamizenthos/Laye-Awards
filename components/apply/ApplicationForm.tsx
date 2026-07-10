'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check, Users, X } from 'lucide-react'
import { categories, CATEGORY_NOMINEE_CAP } from '@/lib/content/categories'
import { TextField, TextArea, SelectField } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { submitApplicationAction } from '@/lib/supabase/applications'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { InlineAuthGate } from '@/components/apply/InlineAuthGate'
import { cn } from '@/lib/utils'

const DRAFT_STORAGE_KEY = 'layeawards.apply.draft.v1'

const EMPTY = {
  fullName: '',
  age: '',
  sex: '',
  maritalStatus: '',
  businessName: '',
  businessAddress: '',
  staffStrength: '',
  annualTurnover: '',
  instagramHandle: '',
  twitterHandle: '',
  facebookHandle: '',
  email: '',
  whatsappNumber: '',
  alternativeNumber: '',
  categorySlug: '',
  statement: '',
  photoUrl: '',
}

type FormState = typeof EMPTY

const categoryOptions = categories.map(category => ({
  value: category.slug,
  label: category.name,
}))

const sexOptions = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
]

const maritalOptions = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'other', label: 'Prefer not to say' },
]

const countWords = (text: string) => (text.trim() === '' ? 0 : text.trim().split(/\s+/).length)

interface SectionProps {
  label: string
  title: string
  description?: string
  children: React.ReactNode
}

function Section({ label, title, description, children }: SectionProps) {
  return (
    <section className="border-t border-hairline pt-8 first:border-t-0 first:pt-0 sm:pt-10 lg:pt-12">
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-gold-deep sm:text-[0.7rem]">
            {label}
          </p>
          <h3 className="mt-3 font-display text-xl font-medium leading-tight text-ink sm:text-2xl lg:text-3xl">
            {title}
          </h3>
          {description && (
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft sm:text-base">
              {description}
            </p>
          )}
        </div>
        <div className="space-y-5 lg:col-span-8">{children}</div>
      </div>
    </section>
  )
}

export function ApplicationForm({ fullCategorySlugs = [] }: { fullCategorySlugs?: string[] }) {
  const searchParams = useSearchParams()
  const fullSet = new Set(fullCategorySlugs)
  const categoryOptionsWithStatus = categoryOptions.map(option =>
    fullSet.has(option.value) ? { ...option, label: `${option.label} · Full` } : option
  )
  const [form, setForm] = useState<FormState>(EMPTY)
  const [fullCategoryName, setFullCategoryName] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [liveResult, setLiveResult] = useState<{ slug: string; votingUrl: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categoryFull, setCategoryFull] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [authedUserId, setAuthedUserId] = useState<string | null>(null)
  const [showAuthGate, setShowAuthGate] = useState(false)
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)
  const [draftLoaded, setDraftLoaded] = useState(false)
  const resumed = useRef(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(DRAFT_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<FormState>
        setForm(current => ({ ...current, ...parsed }))
      }
    } catch {
      /* storage unavailable, ignore */
    }
    setDraftLoaded(true)
  }, [])

  useEffect(() => {
    if (!draftLoaded) return
    try {
      const isEmpty = Object.values(form).every(value => value.trim() === '')
      if (isEmpty) {
        window.localStorage.removeItem(DRAFT_STORAGE_KEY)
      } else {
        window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(form))
      }
    } catch {
      /* ignore */
    }
  }, [form, draftLoaded])

  useEffect(() => {
    if (!draftLoaded) return
    const preset = searchParams?.get('category')
    if (!preset || !categories.some(category => category.slug === preset)) return
    setForm(current => (current.categorySlug ? current : { ...current, categorySlug: preset }))
  }, [draftLoaded, searchParams])

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    let cancelled = false
    supabase.auth.getUser().then(({ data }) => {
      if (!cancelled) setAuthedUserId(data.user?.id ?? null)
    })
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthedUserId(session?.user?.id ?? null)
    })
    return () => {
      cancelled = true
      subscription.subscription.unsubscribe()
    }
  }, [])

  const update = (key: keyof FormState) => (value: string) =>
    setForm(current => ({ ...current, [key]: value }))

  const handleCategoryChange = (value: string) => {
    setForm(current => ({ ...current, categorySlug: value }))
    if (fullSet.has(value)) {
      setFullCategoryName(categories.find(category => category.slug === value)?.name ?? null)
      setCategoryFull(true)
    }
  }

  const updateStatement = (value: string) =>
    setForm(current => {
      // Hard cap at 100 words: block growth past the limit, always allow editing down.
      if (countWords(value) > 100 && countWords(value) >= countWords(current.statement)) {
        return current
      }
      return { ...current, statement: value }
    })

  const filled = (...keys: (keyof FormState)[]) => keys.every(key => form[key].trim() !== '')

  const words = countWords(form.statement)
  const statementOk = words > 0 && words <= 100

  const hasOneSocial =
    form.instagramHandle.trim() !== '' ||
    form.twitterHandle.trim() !== '' ||
    form.facebookHandle.trim() !== ''

  const formValid =
    filled(
      'fullName',
      'age',
      'sex',
      'maritalStatus',
      'businessName',
      'businessAddress',
      'staffStrength',
      'annualTurnover',
      'photoUrl',
      'email',
      'whatsappNumber',
      'categorySlug',
      'statement'
    ) &&
    hasOneSocial &&
    statementOk

  const performSubmit = useCallback(() => {
    setError(null)
    startTransition(async () => {
      const result = await submitApplicationAction(form)
      if (!result.ok) {
        if (result.needsAuth) {
          setShowAuthGate(true)
          return
        }
        if (result.categoryFull) {
          setFullCategoryName(
            categories.find(category => category.slug === form.categorySlug)?.name ?? null
          )
          setCategoryFull(true)
          return
        }
        setError(result.error)
        return
      }
      try {
        window.localStorage.removeItem(DRAFT_STORAGE_KEY)
      } catch {
        /* ignore */
      }
      setLiveResult({ slug: result.slug, votingUrl: result.votingUrl })
      setSubmitted(true)
      setShowAuthGate(false)
    })
  }, [form])

  const handleSubmit = () => {
    setAttemptedSubmit(true)
    if (!formValid) {
      setError('Fill in every required field. The statement must be 100 words or fewer.')
      return
    }
    // The server is the source of truth for auth (it reads the session cookie and
    // returns needsAuth when signed out). Gating on the browser client's getUser
    // here would strand logged-in users whenever that call stalls, so submit and
    // let the server decide.
    performSubmit()
  }

  const handleAuthSuccess = () => {
    setShowAuthGate(false)
    performSubmit()
  }

  useEffect(() => {
    if (resumed.current) return
    if (!draftLoaded || !authedUserId) return
    if (searchParams?.get('resume') !== '1') return
    const hasDraft = Object.values(form).some(value => value.trim() !== '')
    if (!hasDraft) return
    resumed.current = true
    performSubmit()
  }, [draftLoaded, authedUserId, searchParams, form, performSubmit])

  const dismissCategoryFull = useCallback(() => {
    setCategoryFull(false)
    setForm(current => ({ ...current, categorySlug: '' }))
    const field = document.querySelector<HTMLElement>('[name="categorySlug"]')
    field?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    field?.focus?.()
  }, [])

  useEffect(() => {
    if (!categoryFull) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCategoryFull(false)
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [categoryFull])

  if (submitted) {
    const category = categories.find(c => c.slug === form.categorySlug)
    const votingUrl = liveResult?.votingUrl ?? ''
    const copyLink = async () => {
      if (!votingUrl) return
      try {
        await navigator.clipboard.writeText(votingUrl)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2200)
      } catch {
        setCopied(false)
      }
    }
    return (
      <div className="flex flex-col items-center rounded-2xl border border-gold/35 bg-gradient-to-b from-gold/[0.08] to-surface px-6 py-14 text-center sm:px-8 sm:py-16 lg:py-20">
        <span className="flex size-14 items-center justify-center rounded-full bg-gold/15 text-gold sm:size-16">
          <Check className="size-7 sm:size-8" strokeWidth={1.75} />
        </span>
        <p className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold-deep">
          You&apos;re live
        </p>
        <h3 className="mt-3 font-display text-2xl font-medium text-ink sm:text-3xl lg:text-4xl">
          Congratulations, {form.fullName.split(' ')[0] || 'you'}! 🎉
        </h3>
        <p className="mt-3 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg">
          Your entry for <span className="text-ink">{category?.name}</span> is now on the public
          voting page. Voting is open. Start sharing your link to gather votes.
        </p>

        {votingUrl && (
          <div className="mt-7 w-full max-w-md">
            <div className="flex items-center gap-2 rounded-full border border-hairline bg-canvas px-4 py-2.5">
              <span className="min-w-0 flex-1 truncate text-left text-sm text-ink-soft">
                {votingUrl}
              </span>
              <button
                type="button"
                onClick={copyLink}
                className="shrink-0 rounded-full bg-gold px-4 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-onyx transition-transform hover:scale-[1.03]"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button href={liveResult ? `/nominees/${liveResult.slug}` : '/nominees'} withArrow>
                View your page
              </Button>
              <Button href="/dashboard" variant="secondary">
                Go to dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-hairline bg-surface p-5 sm:p-8 lg:p-12">
      <header className="border-b border-hairline pb-6 sm:pb-8 lg:pb-10">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-gold-deep sm:text-[0.7rem]">
          Open for nominations
        </p>
        <h2 className="mt-3 font-display text-2xl font-medium leading-tight text-ink sm:text-3xl lg:text-4xl">
          The application form.
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
          Every field below is required. Drafts save automatically as you type, you can leave and
          come back without losing a thing.
        </p>
      </header>

      <div className="mt-8 space-y-10 sm:mt-10 sm:space-y-12 lg:mt-12 lg:space-y-14">
        <Section label="01 · About you" title="Who you are">
          <TextField
            label="Full name"
            name="fullName"
            required
            placeholder="Your full name"
            value={form.fullName}
            onChange={update('fullName')}
          />
          <div className="grid gap-5 sm:grid-cols-3">
            <TextField
              label="Age"
              name="age"
              required
              digitsOnly
              min={13}
              max={80}
              placeholder="e.g. 32"
              value={form.age}
              onChange={update('age')}
            />
            <SelectField
              label="Sex"
              name="sex"
              required
              placeholder="Select"
              value={form.sex}
              onChange={update('sex')}
              options={sexOptions}
            />
            <SelectField
              label="Marital status"
              name="maritalStatus"
              required
              placeholder="Select"
              value={form.maritalStatus}
              onChange={update('maritalStatus')}
              options={maritalOptions}
            />
          </div>
        </Section>

        <Section label="02 · Your business" title="Tell us about the enterprise">
          <TextField
            label="Business name"
            name="businessName"
            required
            placeholder="Your company"
            value={form.businessName}
            onChange={update('businessName')}
          />
          <TextField
            label="Business address"
            name="businessAddress"
            required
            placeholder="Street, area, Lagos"
            value={form.businessAddress}
            onChange={update('businessAddress')}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Staff strength"
              name="staffStrength"
              required
              digitsOnly
              min={1}
              placeholder="Number of employees"
              value={form.staffStrength}
              onChange={update('staffStrength')}
            />
            <TextField
              label="Annual turnover"
              name="annualTurnover"
              required
              thousandsFormat
              prefix="₦"
              placeholder="25,000,000"
              helper="Approximate is fine."
              value={form.annualTurnover}
              onChange={update('annualTurnover')}
            />
          </div>
          <ImageUpload
            label="Photo or business logo"
            value={form.photoUrl}
            onChange={url => setForm(current => ({ ...current, photoUrl: url }))}
            helper="Headshot or logo. Square or portrait works best. JPG, PNG, WEBP or AVIF up to 5 MB."
          />
        </Section>

        <Section
          label="03 · Contact"
          title="How we reach you"
          description="Add the social handles you use most. At least one is required, the rest are optional."
        >
          <div className="grid gap-5 sm:grid-cols-3">
            <TextField
              label="Instagram handle"
              name="instagramHandle"
              placeholder="@yourhandle"
              value={form.instagramHandle}
              onChange={update('instagramHandle')}
            />
            <TextField
              label="X (Twitter) handle"
              name="twitterHandle"
              placeholder="@yourhandle"
              value={form.twitterHandle}
              onChange={update('twitterHandle')}
            />
            <TextField
              label="Facebook handle"
              name="facebookHandle"
              placeholder="@yourhandle"
              value={form.facebookHandle}
              onChange={update('facebookHandle')}
            />
          </div>
          <TextField
            label="Email address"
            name="email"
            type="email"
            required
            placeholder="you@email.com"
            value={form.email}
            onChange={update('email')}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="WhatsApp number"
              name="whatsappNumber"
              type="tel"
              required
              digitsOnly
              placeholder="080 0000 0000"
              value={form.whatsappNumber}
              onChange={update('whatsappNumber')}
            />
            <TextField
              label="Alternative number"
              name="alternativeNumber"
              type="tel"
              digitsOnly
              placeholder="Optional"
              value={form.alternativeNumber}
              onChange={update('alternativeNumber')}
            />
          </div>
        </Section>

        <Section label="04 · The case" title="What you are putting forward">
          <SelectField
            label="Award category"
            name="categorySlug"
            required
            placeholder="Choose your category"
            value={form.categorySlug}
            onChange={handleCategoryChange}
            options={categoryOptionsWithStatus}
          />
          <div>
            <TextArea
              label="Why do you consider yourself for this award?"
              name="statement"
              required
              rows={7}
              placeholder="In under 100 words, tell the panel about your enterprise and impact…"
              value={form.statement}
              onChange={updateStatement}
            />
            <p
              className={cn(
                'mt-2.5 text-right text-sm',
                words > 100 ? 'text-royal-light' : 'text-ink-faint'
              )}
            >
              {words} / 100 words
            </p>
          </div>
        </Section>
      </div>

      <div className="mt-10 border-t border-hairline pt-7 sm:mt-12 sm:pt-9">
        <Button
          onClick={handleSubmit}
          disabled={isPending}
          magnetic={false}
          withArrow
          className="w-full sm:w-auto"
        >
          {isPending ? 'Submitting…' : 'Submit application'}
        </Button>
        <p className="mt-4 text-xs text-ink-faint sm:text-sm">
          By submitting, your profile goes live on the public voting page straight away and you can
          start sharing your voting link.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-lg border border-red-500/30 bg-red-500/[0.07] px-4 py-3 text-sm leading-relaxed text-red-200"
        >
          {error}
        </p>
      )}

      {showAuthGate && (
        <div className="mt-8">
          <InlineAuthGate
            defaultFullName={form.fullName}
            defaultPhone={form.whatsappNumber}
            defaultEmail={form.email}
            onSuccess={handleAuthSuccess}
          />
        </div>
      )}

      {attemptedSubmit && !formValid && !error && (
        <p role="status" className="mt-4 text-xs text-ink-faint sm:text-sm">
          Scroll up. The missing field is highlighted in red.
        </p>
      )}

      {categoryFull && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="category-full-title"
          className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center"
        >
          <div
            aria-hidden
            onClick={() => setCategoryFull(false)}
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-sm rounded-3xl border border-gold/30 bg-surface p-6 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] sm:p-8">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setCategoryFull(false)}
              className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border border-hairline text-ink-faint transition-colors hover:border-ink/40 hover:text-ink"
            >
              <X className="size-4" strokeWidth={2} />
            </button>
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-gold/15 text-gold">
              <Users className="size-7" strokeWidth={1.6} />
            </span>
            <h3
              id="category-full-title"
              className="mt-5 font-display text-xl font-medium text-ink sm:text-2xl"
            >
              {fullCategoryName ? `${fullCategoryName} is full` : 'This category is full'}
            </h3>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-ink-soft sm:text-base">
              {fullCategoryName
                ? `${fullCategoryName} already has its ${CATEGORY_NOMINEE_CAP} nominees. Numbers of nominees reached for this category, please select another category.`
                : 'Numbers of nominees reached for this category, select another category.'}
            </p>
            <Button type="button" onClick={dismissCategoryFull} className="mt-7 w-full">
              Choose another category
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

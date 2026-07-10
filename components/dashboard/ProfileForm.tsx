'use client'

import { useState, useTransition } from 'react'
import { updateProfileAction } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/Button'
import { ImageUpload } from '@/components/ui/ImageUpload'

interface ProfileFormProps {
  defaultFullName: string
  defaultPhone: string
  defaultAvatarUrl: string
  defaultInstagram: string
  defaultTwitter: string
  defaultFacebook: string
  defaultBusinessName: string
  defaultBusinessAddress: string
  email: string
}

export function ProfileForm({
  defaultFullName,
  defaultPhone,
  defaultAvatarUrl,
  defaultInstagram,
  defaultTwitter,
  defaultFacebook,
  defaultBusinessName,
  defaultBusinessAddress,
  email,
}: ProfileFormProps) {
  const [fullName, setFullName] = useState(defaultFullName)
  const [phone, setPhone] = useState(defaultPhone)
  const [avatarUrl, setAvatarUrl] = useState(defaultAvatarUrl)
  const [instagram, setInstagram] = useState(defaultInstagram)
  const [twitter, setTwitter] = useState(defaultTwitter)
  const [facebook, setFacebook] = useState(defaultFacebook)
  const [businessName, setBusinessName] = useState(defaultBusinessName)
  const [businessAddress, setBusinessAddress] = useState(defaultBusinessAddress)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setNotice(null)
    const formData = new FormData()
    formData.set('fullName', fullName.trim())
    formData.set('phone', phone.trim())
    formData.set('avatarUrl', avatarUrl.trim())
    formData.set('instagram', instagram.trim())
    formData.set('twitter', twitter.trim())
    formData.set('facebook', facebook.trim())
    formData.set('businessName', businessName.trim())
    formData.set('businessAddress', businessAddress.trim())

    startTransition(async () => {
      const result = await updateProfileAction(formData)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setNotice('Profile updated.')
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-7 rounded-2xl border border-hairline bg-surface p-5 sm:p-7 lg:p-9"
    >
      <ImageUpload
        label="Profile picture"
        value={avatarUrl}
        onChange={setAvatarUrl}
        helper="JPG, PNG, WEBP or AVIF up to 5 MB. Square crops work best."
      />

      <Section title="Account">
        <Field
          label="Email"
          type="email"
          value={email}
          readOnly
          helper="Email is the identifier on your account and can't be changed here."
        />
        <Field label="Full name" type="text" value={fullName} onChange={setFullName} required />
        <Field
          label="Phone"
          type="tel"
          value={phone}
          onChange={setPhone}
          placeholder="080 0000 0000"
        />
      </Section>

      <Section title="Business">
        <Field
          label="Business name"
          type="text"
          value={businessName}
          onChange={setBusinessName}
          placeholder="Your company"
        />
        <Field
          label="Business address"
          type="text"
          value={businessAddress}
          onChange={setBusinessAddress}
          placeholder="Street, area, Lagos"
        />
      </Section>

      <Section title="Social handles">
        <div className="grid gap-5 sm:grid-cols-3">
          <Field
            label="Instagram"
            type="text"
            value={instagram}
            onChange={setInstagram}
            placeholder="@yourhandle"
          />
          <Field
            label="X (Twitter)"
            type="text"
            value={twitter}
            onChange={setTwitter}
            placeholder="@yourhandle"
          />
          <Field
            label="Facebook"
            type="text"
            value={facebook}
            onChange={setFacebook}
            placeholder="@yourhandle"
          />
        </div>
      </Section>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isPending}
          magnetic={false}
          withArrow
          className="w-full sm:w-auto"
        >
          {isPending ? 'Saving…' : 'Save changes'}
        </Button>
      </div>

      {notice && (
        <p
          role="status"
          className="rounded-lg border border-gold/30 bg-gold/[0.07] px-4 py-3 text-sm text-ink-soft"
        >
          {notice}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/30 bg-red-500/[0.07] px-4 py-3 text-sm text-red-200"
        >
          {error}
        </p>
      )}
    </form>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-5 border-t border-hairline pt-6 first-of-type:border-t-0 first-of-type:pt-0">
      <legend className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-deep sm:text-[0.7rem]">
        {title}
      </legend>
      {children}
    </fieldset>
  )
}

function Field({
  label,
  type,
  value,
  onChange,
  required,
  placeholder,
  readOnly,
  helper,
}: {
  label: string
  type: 'text' | 'email' | 'tel'
  value: string
  onChange?: (value: string) => void
  required?: boolean
  placeholder?: string
  readOnly?: boolean
  helper?: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-soft sm:text-[0.78rem]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={onChange ? event => onChange(event.target.value) : undefined}
        className={`h-12 w-full rounded-xl border border-hairline bg-canvas px-4 text-sm text-ink outline-none transition-colors duration-200 placeholder:text-ink-faint focus:border-gold ${
          readOnly ? 'cursor-not-allowed opacity-60' : ''
        }`}
      />
      {helper && <p className="mt-2 text-xs text-ink-faint">{helper}</p>}
    </label>
  )
}

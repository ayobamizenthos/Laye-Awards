import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AuthForm } from '@/components/auth/AuthForm'
import { Reveal } from '@/components/motion/Reveal'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a LAYEAWARDS account to apply for an award.',
  alternates: { canonical: '/register' },
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default function RegisterPage() {
  return (
    <div className="theme-light relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[55vh] bg-[radial-gradient(ellipse_45%_60%_at_50%_0%,rgba(168,132,46,0.13),transparent_72%)]"
      />
      <div className="relative w-full max-w-md">
        <Reveal y={28} className="text-center">
          <span className="eyebrow text-gold-deep">Join LAYEAWARDS</span>
          <h1 className="mt-5 font-display text-6xl font-medium text-ink">Create account</h1>
          <p className="mt-3 text-ink-soft">
            One account to apply, track votes, and share your link.
          </p>
        </Reveal>
        <Reveal y={32} delay={0.1} className="mt-9">
          <Suspense
            fallback={<div className="h-[640px] rounded-2xl border border-hairline bg-surface" />}
          >
            <AuthForm mode="register" />
          </Suspense>
        </Reveal>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AuthForm } from '@/components/auth/AuthForm'
import { Reveal } from '@/components/motion/Reveal'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your LAYEAWARDS account.',
  alternates: { canonical: '/login' },
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[55vh] bg-[radial-gradient(ellipse_45%_60%_at_50%_0%,rgba(201,168,76,0.13),transparent_72%)]"
      />
      <div className="relative w-full max-w-md">
        <Reveal y={28} className="text-center">
          <span className="eyebrow text-gold-deep">Welcome Back</span>
          <h1 className="mt-5 font-display text-6xl font-medium text-ink">Sign in</h1>
          <p className="mt-3 text-ink-soft">Pick up where you left off with your application.</p>
        </Reveal>
        <Reveal y={32} delay={0.1} className="mt-9">
          <Suspense
            fallback={<div className="h-[420px] rounded-2xl border border-hairline bg-surface" />}
          >
            <AuthForm mode="login" />
          </Suspense>
        </Reveal>
      </div>
    </div>
  )
}

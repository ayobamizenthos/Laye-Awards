import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'lockup' | 'full'
  className?: string
}

export function Logo({ variant = 'lockup', className }: LogoProps) {
  if (variant === 'full') {
    return (
      <Link
        href="/"
        aria-label="LAYEAWARDS, home"
        data-cursor-hover
        className={cn('inline-block', className)}
      >
        <Image
          src="/laye-logo.png"
          alt="LAYEAWARDS, Lagos Young Entrepreneurs Awards"
          width={597}
          height={668}
          className="h-auto w-auto"
        />
      </Link>
    )
  }

  return (
    <Link
      href="/"
      aria-label="LAYEAWARDS, home"
      data-cursor-hover
      className={cn('group/logo inline-flex items-center gap-3', className)}
    >
      <Image
        src="/laye-emblem.png"
        alt=""
        width={497}
        height={461}
        priority
        className="h-8 w-auto transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/logo:scale-105 sm:h-10 lg:h-11"
      />
      <span className="font-sans text-[0.78rem] font-semibold uppercase leading-none tracking-[0.18em] text-ink sm:text-[0.88rem] sm:tracking-[0.22em] lg:text-[0.95rem] lg:tracking-[0.24em]">
        Laye<span className="text-gold">awards</span>
      </span>
    </Link>
  )
}

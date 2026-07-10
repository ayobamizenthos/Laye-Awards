'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Magnetic } from '@/components/motion/Magnetic'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
  withArrow?: boolean
  magnetic?: boolean
  disabled?: boolean
  target?: string
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-10 px-5 text-[0.78rem]',
  md: 'h-13 px-8 text-[0.82rem]',
  lg: 'h-15 px-10 text-[0.86rem]',
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-br from-gold-light via-gold to-gold-deep text-onyx shadow-[0_10px_30px_-12px_rgba(236,193,99,0.65),inset_0_1px_0_rgba(255,255,255,0.35)] hover:shadow-[0_16px_42px_-12px_rgba(236,193,99,0.8)]',
  secondary: 'bg-transparent text-ink ring-1 ring-inset ring-gold/40',
  ghost: 'bg-transparent text-ink',
}

const wipeStyles: Record<ButtonVariant, string> = {
  primary: 'bg-gold-light',
  secondary: 'bg-gold',
  ghost: 'bg-transparent',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  type = 'button',
  className,
  withArrow = false,
  magnetic = true,
  disabled = false,
  target,
}: ButtonProps) {
  const base = cn(
    'group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full',
    'font-sans font-semibold uppercase tracking-[0.16em]',
    'transition-[color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
    'disabled:pointer-events-none disabled:opacity-45',
    sizeStyles[size],
    variantStyles[variant],
    variant === 'primary' && 'hover:text-onyx',
    variant === 'secondary' && 'hover:text-onyx hover:ring-gold',
    className
  )

  const inner = (
    <>
      {variant !== 'ghost' && (
        <span
          aria-hidden
          className={cn(
            'absolute inset-0 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-y-0',
            wipeStyles[variant]
          )}
        />
      )}
      <span className="relative z-10 flex items-center gap-2.5 leading-none">
        {children}
        {withArrow && (
          <ArrowUpRight
            className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
            strokeWidth={1.75}
          />
        )}
      </span>
      {variant === 'ghost' && (
        <span
          aria-hidden
          className="absolute bottom-1.5 left-5 right-5 h-px origin-right scale-x-100 bg-gold/45 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:origin-left"
        />
      )}
    </>
  )

  const element = href ? (
    <Link href={href} target={target} onClick={onClick} className={base} data-cursor-hover>
      {inner}
    </Link>
  ) : (
    <button type={type} onClick={onClick} disabled={disabled} className={base} data-cursor-hover>
      {inner}
    </button>
  )

  if (magnetic && !disabled) {
    return <Magnetic strength={0.28}>{element}</Magnetic>
  }
  return element
}

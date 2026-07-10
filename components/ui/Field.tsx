'use client'

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BaseProps {
  label: string
  name: string
  required?: boolean
  placeholder?: string
  className?: string
}

const fieldShell =
  'w-full rounded-xl border border-hairline bg-surface px-5 text-base text-ink outline-none transition-colors duration-300 placeholder:text-ink-faint focus:border-gold'

const ariaBool = (value: boolean): 'true' | 'false' => (value ? 'true' : 'false')

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return <span className="mb-2.5 block text-[0.95rem] font-medium text-ink">{label}</span>
}

interface TextFieldProps extends BaseProps {
  type?: 'text' | 'email' | 'tel' | 'password' | 'date' | 'number'
  value: string
  onChange: (value: string) => void
  autoComplete?: string
  digitsOnly?: boolean
  thousandsFormat?: boolean
  prefix?: string
  min?: number
  max?: number
  helper?: string
}

const formatThousands = (raw: string) => {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return ''
  return Number(digits).toLocaleString('en-NG')
}

export function TextField({
  label,
  name,
  type = 'text',
  required,
  placeholder,
  value,
  onChange,
  autoComplete,
  digitsOnly,
  thousandsFormat,
  prefix,
  min,
  max,
  helper,
  className,
}: TextFieldProps) {
  const isPassword = type === 'password'
  const [revealed, setRevealed] = useState(false)
  const inputType = isPassword
    ? revealed
      ? 'text'
      : 'password'
    : type === 'number'
      ? 'text'
      : type

  const display = thousandsFormat ? formatThousands(value) : value

  const handleChange = (raw: string) => {
    if (thousandsFormat) {
      onChange(raw.replace(/\D/g, ''))
      return
    }
    if (digitsOnly || type === 'number') {
      onChange(raw.replace(/\D/g, ''))
      return
    }
    onChange(raw)
  }

  return (
    <label className={cn('block', className)}>
      <FieldLabel label={label} required={required} />
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 font-display text-lg text-gilded">
            {prefix}
          </span>
        )}
        <input
          type={inputType}
          name={name}
          required={required}
          placeholder={placeholder}
          value={display}
          autoComplete={autoComplete}
          inputMode={digitsOnly || thousandsFormat || type === 'number' ? 'numeric' : undefined}
          pattern={digitsOnly || thousandsFormat || type === 'number' ? '[0-9]*' : undefined}
          min={min}
          max={max}
          onChange={event => handleChange(event.target.value)}
          className={cn(fieldShell, 'h-14', isPassword && 'pr-14', prefix && 'pl-10')}
        />
        {isPassword && (
          <button
            type="button"
            aria-label={revealed ? 'Hide password' : 'Show password'}
            aria-pressed={ariaBool(revealed)}
            onClick={() => setRevealed(value => !value)}
            tabIndex={-1}
            className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-faint transition-colors duration-200 hover:bg-canvas hover:text-ink-soft"
          >
            {revealed ? (
              <EyeOff className="size-4" strokeWidth={1.75} />
            ) : (
              <Eye className="size-4" strokeWidth={1.75} />
            )}
          </button>
        )}
      </div>
      {helper && <p className="mt-2 text-xs text-ink-faint">{helper}</p>}
    </label>
  )
}

interface TextAreaProps extends BaseProps {
  value: string
  onChange: (value: string) => void
  rows?: number
}

export function TextArea({
  label,
  name,
  required,
  placeholder,
  value,
  onChange,
  rows = 5,
  className,
}: TextAreaProps) {
  return (
    <label className={cn('block', className)}>
      <FieldLabel label={label} required={required} />
      <textarea
        name={name}
        required={required}
        placeholder={placeholder}
        value={value}
        rows={rows}
        onChange={event => onChange(event.target.value)}
        className={cn(fieldShell, 'resize-none py-4 leading-relaxed')}
      />
    </label>
  )
}

interface SelectFieldProps extends BaseProps {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}

export function SelectField({
  label,
  name,
  required,
  value,
  onChange,
  options,
  placeholder,
  className,
}: SelectFieldProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(null)
  const [highlight, setHighlight] = useState<number>(-1)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const listRef = useRef<HTMLUListElement | null>(null)

  const selected = options.find(option => option.value === value)

  useEffect(() => {
    setMounted(true)
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    const measure = () => {
      const node = buttonRef.current
      if (!node) return
      const box = node.getBoundingClientRect()
      setRect({ top: box.bottom + 8, left: box.left, width: box.width })
    }
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onClick = (event: MouseEvent) => {
      if (
        !buttonRef.current?.contains(event.target as Node) &&
        !listRef.current?.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    if (open && value) {
      const index = options.findIndex(option => option.value === value)
      setHighlight(index)
    } else if (open) {
      setHighlight(0)
    }
  }, [open, options, value])

  const select = (next: string) => {
    onChange(next)
    setOpen(false)
    buttonRef.current?.focus()
  }

  const handleButtonKey = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpen(true)
    }
  }

  const handleListKey = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlight(current => Math.min(options.length - 1, current + 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlight(current => Math.max(0, current - 1))
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (highlight >= 0) select(options[highlight].value)
    } else if (event.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div className={cn('block', className)}>
      <label htmlFor={`${id}-button`}>
        <FieldLabel label={label} required={required} />
      </label>
      <div className="relative">
        <button
          id={`${id}-button`}
          ref={buttonRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={ariaBool(open)}
          onClick={() => setOpen(v => !v)}
          onKeyDown={handleButtonKey}
          className={cn(
            fieldShell,
            'flex h-14 items-center justify-between pr-12 text-left',
            !selected && 'text-ink-faint'
          )}
        >
          <span className="truncate">
            {selected ? selected.label : (placeholder ?? 'Select an option')}
          </span>
          <ChevronDown
            className={cn(
              'pointer-events-none absolute right-5 top-1/2 size-4 -translate-y-1/2 text-gold transition-transform duration-300',
              open && 'rotate-180'
            )}
            strokeWidth={1.75}
          />
        </button>

        <input type="hidden" name={name} value={value} required={required} aria-hidden="true" />

        {open &&
          mounted &&
          rect &&
          createPortal(
            <ul
              ref={listRef}
              role="listbox"
              tabIndex={-1}
              onKeyDown={handleListKey}
              data-lenis-prevent
              aria-activedescendant={highlight >= 0 ? `${id}-option-${highlight}` : undefined}
              style={{
                position: 'fixed',
                top: rect.top,
                left: rect.left,
                width: rect.width,
                overscrollBehavior: 'contain',
              }}
              className="dropdown-scroll z-[200] max-h-72 overflow-y-auto overflow-x-hidden rounded-xl border border-hairline bg-surface py-1.5 shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
            >
              {options.map((option, index) => {
                const isSelected = option.value === value
                const isHighlighted = highlight === index
                return (
                  <li
                    id={`${id}-option-${index}`}
                    key={option.value}
                    role="option"
                    // eslint-disable-next-line jsx-a11y/aria-proptypes
                    aria-selected={ariaBool(isSelected)}
                    onMouseEnter={() => setHighlight(index)}
                    onMouseDown={event => {
                      event.preventDefault()
                      select(option.value)
                    }}
                    className={cn(
                      'flex cursor-pointer items-center justify-between gap-3 px-5 py-2.5 text-sm transition-colors duration-150',
                      isHighlighted ? 'bg-gold/[0.12] text-ink' : 'text-ink-soft',
                      isSelected && 'text-gold-deep'
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && <span aria-hidden className="size-1.5 rounded-full bg-gold" />}
                  </li>
                )
              })}
            </ul>,
            document.body
          )}
      </div>
    </div>
  )
}

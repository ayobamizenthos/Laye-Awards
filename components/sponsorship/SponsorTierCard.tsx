import { ArrowUpRight, Check } from 'lucide-react'
import { siteConfig } from '@/config/site'
import type { SponsorshipTier } from '@/lib/content/content'
import { cn } from '@/lib/utils'

function tierMailto(tier: SponsorshipTier) {
  const subject = `Sponsorship Enquiry: ${tier.name} · ${siteConfig.edition.eyebrow}`
  const body = `Hello LAYEAWARDS team,

We would like to partner with the ${siteConfig.fullName} (${siteConfig.edition.ordinal} Edition) as a ${tier.name} sponsor (${tier.priceLabel}).

Please share the next steps to confirm this tier, along with the partnership deck and available activation dates.

Our details:
• Organisation:
• Contact name:
• Phone:

We look forward to standing beside Lagos' boldest night.

Best regards,`
  return `mailto:${siteConfig.contact.sponsorships}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`
}

export function SponsorTierCard({ tier }: { tier: SponsorshipTier }) {
  return (
    <a
      href={tierMailto(tier)}
      data-cursor-hover
      className={cn(
        'group/tier flex h-full flex-col rounded-2xl border-2 bg-white p-6 shadow-[0_16px_40px_-26px_rgba(151,116,42,0.45)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-[0_30px_66px_-30px_rgba(151,116,42,0.6)] sm:p-7',
        tier.featured ? 'border-gold ring-2 ring-gold/25' : 'border-gold/30 hover:border-gold/70'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          {tier.featured && (
            <span className="mb-2 inline-block rounded-full bg-gold px-3 py-1 text-[0.56rem] font-bold uppercase tracking-[0.16em] text-onyx">
              Headline Partner
            </span>
          )}
          <h3 className="font-display text-xl font-medium text-ink sm:text-2xl">{tier.name}</h3>
          {tier.limited && (
            <span className="mt-2 inline-block rounded-full bg-gold/15 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-gold-deep">
              {tier.limited}
            </span>
          )}
        </div>
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold-deep transition-all duration-300 group-hover/tier:border-gold group-hover/tier:bg-gold group-hover/tier:text-onyx"
        >
          <ArrowUpRight className="size-4" strokeWidth={1.75} />
        </span>
      </div>

      <p className="mt-4 font-display text-3xl text-gilded sm:text-4xl">{tier.priceLabel}</p>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{tier.summary}</p>

      <ul className="mt-5 flex-1 space-y-2.5 border-t border-gold/15 pt-5">
        {tier.benefits.map(benefit => (
          <li key={benefit} className="flex gap-2.5">
            <Check className="mt-0.5 size-4 shrink-0 text-gold-deep" strokeWidth={2.5} />
            <span className="text-[0.82rem] leading-relaxed text-ink/85">{benefit}</span>
          </li>
        ))}
      </ul>

      <span className="mt-6 inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-gold-deep">
        Select this tier
        <ArrowUpRight
          className="size-3.5 transition-transform duration-300 group-hover/tier:translate-x-0.5 group-hover/tier:-translate-y-0.5"
          strokeWidth={2}
        />
      </span>
    </a>
  )
}

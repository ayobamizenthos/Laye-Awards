'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { Section, Container } from '@/components/ui/Section'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Reveal } from '@/components/motion/Reveal'

const faqs = [
  {
    question: 'Who can apply?',
    answer:
      'Any founder under fifty running an enterprise rooted in Lagos. Forty-three competitive categories cover every sector, plus three special honours reserved for the few.',
  },
  {
    question: 'Is there a cost to apply?',
    answer:
      'No. Registration is free for every applicant. You will only pay if you choose to cast public votes during the voting window.',
  },
  {
    question: 'How are winners decided?',
    answer:
      'The review panel shortlists four finalists per category against the eligibility brief. The public then votes online to crown the winner of each title.',
  },
  {
    question: 'How much does a vote cost?',
    answer:
      'A single vote is ₦100. Voters can cast as many votes as they like, paid by card via Paystack or by direct bank transfer to the LAYEAWARDS account.',
  },
  {
    question: 'When does registration open and close?',
    answer: `Registration runs from ${siteConfig.timeline.nominationsOpen} to ${siteConfig.timeline.nominationsClose}. Public voting opens shortly after the panel publishes the finalists.`,
  },
  {
    question: 'How does the partnership work for sponsors?',
    answer:
      'Six partnership tiers are open, from a reserved table at the ceremony to exclusive headline billing across the edition. The Sponsorship page lays out every tier and what it includes.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <Section className="relative overflow-hidden border-t border-hairline">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_50%_0%,rgba(201,168,76,0.09),transparent_72%)]"
      />
      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionIntro
              eyebrow="Honest Answers"
              heading={
                <>
                  Everything you need
                  <br />
                  to know, <em className="italic text-gilded">first</em>.
                </>
              }
              lead="The questions applicants, voters and sponsors ask before they commit."
            />

            <Reveal delay={0.1} className="mt-7 sm:mt-9">
              <Link
                href="/contact"
                data-cursor-hover
                className="group/email inline-flex items-center gap-3 rounded-full bg-gold px-6 py-3 font-sans text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-onyx transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03] sm:px-7 sm:py-3.5"
              >
                <span
                  aria-hidden
                  className="flex size-7 items-center justify-center rounded-full bg-onyx text-gold"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="size-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                Contact Team
              </Link>
            </Reveal>

            <Reveal delay={0.18} className="mt-10 hidden lg:block">
              <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/[0.09] via-transparent to-transparent p-9">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-12 -top-12 size-56 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.18),transparent_70%)]"
                />
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="size-9 text-gold"
                  fill="currentColor"
                >
                  <path d="M12 0 L14.35 9.65 L24 12 L14.35 14.35 L12 24 L9.65 14.35 L0 12 L9.65 9.65 Z" />
                </svg>
                <p className="mt-7 font-display text-2xl italic leading-snug text-ink">
                  We answer the questions Lagos founders really ask, before they put their name in.
                </p>
                <div className="mt-7 flex items-center gap-4">
                  <span className="h-px w-10 bg-gold" />
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold-deep">
                    The LAYEAWARDS team
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal y={32} delay={0.08} className="lg:col-span-7">
            <ul className="divide-y divide-hairline border-t border-hairline">
              {faqs.map((item, index) => {
                const isOpen = openIndex === index
                return (
                  <li key={item.question}>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      aria-expanded={isOpen ? 'true' : 'false'}
                      data-cursor-hover
                      className="group/q flex w-full items-center justify-between gap-6 py-5 text-left transition-colors duration-300 hover:text-gold sm:py-6"
                    >
                      <span
                        className={`font-display text-lg leading-tight transition-colors duration-300 sm:text-xl lg:text-2xl ${
                          isOpen ? 'text-gilded' : 'text-ink group-hover/q:text-gold'
                        }`}
                      >
                        {item.question}
                      </span>
                      <span
                        aria-hidden
                        className={`flex size-9 shrink-0 items-center justify-center rounded-full border border-hairline transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:size-10 ${
                          isOpen
                            ? 'rotate-45 border-gold bg-gold text-onyx'
                            : 'text-ink-soft group-hover/q:border-gold group-hover/q:text-gold-deep'
                        }`}
                      >
                        <Plus className="size-4 sm:size-[18px]" strokeWidth={1.5} />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            height: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                            opacity: { duration: 0.3 },
                          }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-2xl pb-6 pr-12 text-sm leading-relaxed text-ink-soft sm:pb-8 sm:text-base">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                )
              })}
            </ul>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}

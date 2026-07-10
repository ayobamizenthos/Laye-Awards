import Link from 'next/link'
import Image from 'next/image'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getCategoryBySlug } from '@/lib/content/categories'
import { HashScroller } from '@/components/admin/HashScroller'

export const dynamic = 'force-dynamic'

export default async function AdminNomineesPage() {
  const supabase = await createSupabaseServerClient()
  const { data: nominees } = await supabase
    .from('nominees')
    .select(
      'id, slug, full_name, business_name, category_slug, headline, headshot_url, total_votes, is_published, created_at'
    )
    .order('total_votes', { ascending: false })

  return (
    <div className="space-y-12">
      <HashScroller />
      <section className="flex flex-wrap items-baseline justify-between gap-6">
        <div>
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold-deep sm:text-[0.7rem]">
            The shortlist
          </span>
          <h2 className="mt-3 font-display text-2xl font-medium text-ink sm:text-3xl lg:text-4xl">
            Published nominees
          </h2>
        </div>
        <p className="text-[0.7rem] uppercase tracking-[0.16em] text-ink-faint">
          {nominees?.length ?? 0} {(nominees?.length ?? 0) === 1 ? 'nominee live' : 'nominees live'}
        </p>
      </section>

      {!nominees || nominees.length === 0 ? (
        <p className="rounded-2xl border border-hairline bg-surface px-7 py-16 text-center text-ink-soft">
          Approve an application to publish your first nominee.
        </p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {nominees.map(nominee => {
            const category = getCategoryBySlug(nominee.category_slug)
            return (
              <li
                key={nominee.id}
                id={`nominee-${nominee.id}`}
                className="scroll-mt-28 sm:scroll-mt-32"
              >
                <Link
                  href={`/admin/nominees/${nominee.id}`}
                  className="group/card block overflow-hidden rounded-2xl border border-hairline bg-surface transition-colors duration-300 hover:border-gold/35 target:[&]:border-gold/60 target:[&]:shadow-[0_0_0_2px_rgba(203,169,78,0.18)]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-canvas">
                    {nominee.headshot_url ? (
                      <Image
                        src={nominee.headshot_url}
                        alt={nominee.full_name}
                        fill
                        sizes="(max-width: 1024px) 50vw, 33vw"
                        unoptimized
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center font-display text-5xl text-ink-faint">
                        {nominee.full_name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-onyx/95 via-onyx/35 to-transparent p-5">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-gold-light">
                        {category?.shortName ?? nominee.category_slug}
                      </p>
                      <p className="font-display text-3xl font-medium text-white">
                        {nominee.total_votes.toLocaleString()}
                      </p>
                    </div>
                    {!nominee.is_published && (
                      <span className="absolute right-3 top-3 rounded-full bg-onyx/80 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-ink-faint backdrop-blur-sm">
                        Hidden
                      </span>
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-4 p-6">
                    <div className="min-w-0">
                      <p className="font-display text-xl text-ink truncate">{nominee.full_name}</p>
                      <p className="mt-1 text-sm text-ink-faint truncate">
                        {nominee.business_name}
                      </p>
                    </div>
                    <span className="shrink-0 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink-faint transition-colors duration-300 group-hover/card:text-gold-deep">
                      Edit →
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

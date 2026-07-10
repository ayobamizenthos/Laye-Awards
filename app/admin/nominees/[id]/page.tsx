import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getCategoryBySlug } from '@/lib/content/categories'
import { NomineeEditor } from '@/components/admin/NomineeEditor'

export const dynamic = 'force-dynamic'

export default async function AdminNomineeEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()
  const { data: nominee } = await supabase
    .from('nominees')
    .select(
      'id, slug, full_name, business_name, category_slug, industry, headline, bio, headshot_url, total_votes, is_published, created_at'
    )
    .eq('id', id)
    .maybeSingle()

  if (!nominee) notFound()

  const category = getCategoryBySlug(nominee.category_slug)

  return (
    <div className="space-y-12">
      <Link
        href="/admin/nominees"
        className="inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink-faint transition-colors duration-200 hover:text-gold-deep"
      >
        <ArrowLeft className="size-4" strokeWidth={1.75} />
        All nominees
      </Link>

      <section className="grid gap-6 border-b border-hairline pb-5 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold-deep">
            {category?.shortName ?? nominee.category_slug}
          </span>
          <h2 className="mt-3 font-display text-3xl font-medium leading-tight text-ink sm:text-4xl lg:text-5xl">
            {nominee.full_name}
          </h2>
          <p className="mt-2 font-display text-lg italic leading-snug text-ink-soft sm:text-xl">
            {nominee.business_name}
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-x-8 text-sm lg:col-span-4">
          <div>
            <dt className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">
              Votes
            </dt>
            <dd className="mt-1.5 font-display text-3xl text-gilded">
              {nominee.total_votes.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">
              Visibility
            </dt>
            <dd className="mt-1.5 font-display text-xl text-ink">
              {nominee.is_published ? 'Public' : 'Hidden'}
            </dd>
          </div>
        </dl>
      </section>

      <NomineeEditor
        nomineeId={nominee.id}
        slug={nominee.slug}
        defaults={{
          fullName: nominee.full_name,
          businessName: nominee.business_name,
          industry: nominee.industry ?? '',
          headline: nominee.headline,
          bio: nominee.bio,
          headshotUrl: nominee.headshot_url,
          isPublished: nominee.is_published,
        }}
      />
    </div>
  )
}

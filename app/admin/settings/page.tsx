import { createSupabaseServerClient } from '@/lib/supabase/server'
import { AdminSettingsForm } from '@/components/admin/AdminSettingsForm'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: settings } = await supabase
    .from('voting_settings')
    .select('is_open, price_per_vote_kobo, voting_opens_at, voting_closes_at, updated_at')
    .eq('id', 1)
    .single()

  return (
    <div className="space-y-14">
      <section>
        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold-deep sm:text-[0.7rem]">
          Voting controls
        </span>
        <h2 className="mt-3 font-display text-2xl font-medium text-ink sm:text-3xl lg:text-4xl">
          Open the room, set the price.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
          Decide when the public can vote and how much each ballot costs. Changes are immediate.
        </p>
      </section>

      <AdminSettingsForm
        initialOpen={settings?.is_open ?? false}
        initialPriceKobo={settings?.price_per_vote_kobo ?? 10000}
        initialOpensAt={settings?.voting_opens_at ?? null}
        initialClosesAt={settings?.voting_closes_at ?? null}
      />
    </div>
  )
}

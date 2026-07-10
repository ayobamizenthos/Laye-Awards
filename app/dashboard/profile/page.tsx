import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/dashboard/ProfileForm'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/dashboard/profile')

  const { data: profile } = await supabase
    .from('profiles')
    .select(
      'full_name, phone, role, avatar_url, instagram_handle, twitter_handle, facebook_handle, business_name, business_address'
    )
    .eq('id', user.id)
    .single()

  return (
    <div className="space-y-10 sm:space-y-12">
      <section className="border-b border-hairline pb-5">
        <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold-deep sm:text-[0.7rem]">
          Profile
        </span>
        <h2 className="mt-3 font-display text-2xl font-medium text-ink sm:text-3xl lg:text-4xl">
          Your details on file.
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
          Update your profile picture, contact, business and social links here. Anything you submit
          on an application keeps this profile in sync automatically.
        </p>
      </section>

      <ProfileForm
        defaultFullName={profile?.full_name ?? ''}
        defaultPhone={profile?.phone ?? ''}
        defaultAvatarUrl={profile?.avatar_url ?? ''}
        defaultInstagram={profile?.instagram_handle ?? ''}
        defaultTwitter={profile?.twitter_handle ?? ''}
        defaultFacebook={profile?.facebook_handle ?? ''}
        defaultBusinessName={profile?.business_name ?? ''}
        defaultBusinessAddress={profile?.business_address ?? ''}
        email={user.email ?? ''}
      />
    </div>
  )
}

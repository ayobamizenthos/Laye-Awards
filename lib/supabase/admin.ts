'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'
import { sendNomineeLiveEmail, sendApplicationRejectedEmail } from '@/lib/email'
import { getCategoryBySlug } from '@/lib/content/categories'
import { siteConfig } from '@/config/site'

async function requireAdmin() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, error: 'Not signed in.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return { ok: false as const, error: 'Admin only.' }
  return { ok: true as const, supabase, userId: user.id }
}

const slugify = (input: string) =>
  input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)

export async function approveApplicationAction(applicationId: string, formData: FormData) {
  const guard = await requireAdmin()
  if (!guard.ok) return { ok: false as const, error: guard.error }

  const headline = String(formData.get('headline') ?? '').trim()
  const bio = String(formData.get('bio') ?? '').trim()
  const headshotUrl = String(formData.get('headshotUrl') ?? '').trim()
  const industry = String(formData.get('industry') ?? '').trim()
  const slugOverride = String(formData.get('slug') ?? '').trim()

  if (!headline || !bio || !headshotUrl) {
    return { ok: false as const, error: 'Headline, bio and headshot URL are required.' }
  }

  const service = createSupabaseServiceClient()
  const { data: app } = await service
    .from('applications')
    .select('id, full_name, business_name, category_slug, applicant_id, email')
    .eq('id', applicationId)
    .single()
  if (!app) return { ok: false as const, error: 'Application not found.' }

  const baseSlug = slugify(slugOverride || `${app.full_name}-${app.business_name}`)
  let slug = baseSlug
  let attempt = 0
  while (attempt < 5) {
    const { data: clash } = await service
      .from('nominees')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()
    if (!clash) break
    attempt += 1
    slug = `${baseSlug}-${attempt + 1}`
  }

  const { error: nomineeError } = await service.from('nominees').insert({
    application_id: app.id,
    slug,
    full_name: app.full_name,
    business_name: app.business_name,
    category_slug: app.category_slug,
    industry: industry || null,
    headline,
    bio,
    headshot_url: headshotUrl,
    is_published: true,
  })
  if (nomineeError) return { ok: false as const, error: nomineeError.message }

  const { error: updateError } = await service
    .from('applications')
    .update({ status: 'approved', reviewed_at: new Date().toISOString() })
    .eq('id', app.id)
  if (updateError) return { ok: false as const, error: updateError.message }

  const category = getCategoryBySlug(app.category_slug)
  try {
    await sendNomineeLiveEmail({
      to: app.email,
      applicantName: app.full_name,
      categoryName: category?.name ?? app.category_slug,
      votingUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? siteConfig.url}/nominees/${slug}`,
    })
  } catch (mailError) {
    console.error('[email] nominee approved failed:', mailError)
  }

  revalidatePath('/admin/applications')
  revalidatePath('/admin/nominees')
  revalidatePath('/nominees')
  return { ok: true as const }
}

export async function rejectApplicationAction(applicationId: string, formData: FormData) {
  const guard = await requireAdmin()
  if (!guard.ok) return { ok: false as const, error: guard.error }

  const notes = String(formData.get('notes') ?? '').trim()
  const service = createSupabaseServiceClient()
  const { data: app } = await service
    .from('applications')
    .select('full_name, email, category_slug')
    .eq('id', applicationId)
    .maybeSingle()
  const { error } = await service
    .from('applications')
    .update({
      status: 'rejected',
      admin_notes: notes || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', applicationId)
  if (error) return { ok: false as const, error: error.message }

  if (app) {
    const category = getCategoryBySlug(app.category_slug)
    try {
      await sendApplicationRejectedEmail({
        to: app.email,
        applicantName: app.full_name,
        categoryName: category?.name ?? app.category_slug,
        note: notes || null,
      })
    } catch (mailError) {
      console.error('[email] application rejected failed:', mailError)
    }
  }

  revalidatePath('/admin/applications')
  return { ok: true as const }
}

export async function deleteApplicationAction(applicationId: string) {
  const guard = await requireAdmin()
  if (!guard.ok) return { ok: false as const, error: guard.error }
  const service = createSupabaseServiceClient()
  const { error } = await service.from('applications').delete().eq('id', applicationId)
  if (error) return { ok: false as const, error: error.message }
  revalidatePath('/admin/applications')
  return { ok: true as const }
}

export async function toggleVotingOpenAction(open: boolean) {
  const guard = await requireAdmin()
  if (!guard.ok) return { ok: false as const, error: guard.error }

  const service = createSupabaseServiceClient()
  const { error } = await service
    .from('voting_settings')
    .update({ is_open: open, updated_at: new Date().toISOString() })
    .eq('id', 1)
  if (error) return { ok: false as const, error: error.message }

  revalidatePath('/admin/settings')
  revalidatePath('/nominees')
  return { ok: true as const }
}

export async function updateNomineeAction(
  nomineeId: string,
  payload: {
    fullName: string
    businessName: string
    industry: string
    headline: string
    bio: string
    headshotUrl: string
    isPublished: boolean
  }
) {
  const guard = await requireAdmin()
  if (!guard.ok) return { ok: false as const, error: guard.error }

  if (!payload.fullName.trim() || !payload.headline.trim() || !payload.bio.trim()) {
    return { ok: false as const, error: 'Name, headline and bio are required.' }
  }

  const service = createSupabaseServiceClient()
  const { error } = await service
    .from('nominees')
    .update({
      full_name: payload.fullName.trim(),
      business_name: payload.businessName.trim(),
      industry: payload.industry.trim() || null,
      headline: payload.headline.trim(),
      bio: payload.bio.trim(),
      headshot_url: payload.headshotUrl.trim(),
      is_published: payload.isPublished,
    })
    .eq('id', nomineeId)
  if (error) return { ok: false as const, error: error.message }

  revalidatePath('/admin/nominees')
  revalidatePath('/nominees')
  revalidatePath(`/nominees`)
  return { ok: true as const }
}

export async function toggleNomineePublishedAction(nomineeId: string, isPublished: boolean) {
  const guard = await requireAdmin()
  if (!guard.ok) return { ok: false as const, error: guard.error }
  const service = createSupabaseServiceClient()
  const { error } = await service
    .from('nominees')
    .update({ is_published: isPublished })
    .eq('id', nomineeId)
  if (error) return { ok: false as const, error: error.message }
  revalidatePath('/admin/nominees')
  revalidatePath('/nominees')
  return { ok: true as const }
}

export async function deleteNomineeAction(nomineeId: string) {
  const guard = await requireAdmin()
  if (!guard.ok) return { ok: false as const, error: guard.error }
  const service = createSupabaseServiceClient()
  const { error } = await service.from('nominees').delete().eq('id', nomineeId)
  if (error) return { ok: false as const, error: error.message }
  revalidatePath('/admin/nominees')
  revalidatePath('/nominees')
  return { ok: true as const }
}

export async function setVotingWindowAction(opensAt: string | null, closesAt: string | null) {
  const guard = await requireAdmin()
  if (!guard.ok) return { ok: false as const, error: guard.error }

  const opens = opensAt ? new Date(opensAt) : null
  const closes = closesAt ? new Date(closesAt) : null
  if (opens && Number.isNaN(opens.valueOf())) {
    return { ok: false as const, error: 'Invalid opening date.' }
  }
  if (closes && Number.isNaN(closes.valueOf())) {
    return { ok: false as const, error: 'Invalid closing date.' }
  }
  if (opens && closes && opens >= closes) {
    return { ok: false as const, error: 'Opening date must come before closing date.' }
  }

  const service = createSupabaseServiceClient()
  const { error } = await service
    .from('voting_settings')
    .update({
      voting_opens_at: opens?.toISOString() ?? null,
      voting_closes_at: closes?.toISOString() ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 1)
  if (error) return { ok: false as const, error: error.message }

  revalidatePath('/admin/settings')
  revalidatePath('/nominees')
  return { ok: true as const }
}

export async function setVotePriceAction(pricePerVoteKobo: number) {
  const guard = await requireAdmin()
  if (!guard.ok) return { ok: false as const, error: guard.error }
  if (!Number.isFinite(pricePerVoteKobo) || pricePerVoteKobo < 100) {
    return { ok: false as const, error: 'Price must be at least 100 kobo (₦1).' }
  }
  const service = createSupabaseServiceClient()
  const { error } = await service
    .from('voting_settings')
    .update({ price_per_vote_kobo: pricePerVoteKobo, updated_at: new Date().toISOString() })
    .eq('id', 1)
  if (error) return { ok: false as const, error: error.message }

  revalidatePath('/admin/settings')
  return { ok: true as const }
}

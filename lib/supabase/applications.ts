'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'
import { sendNomineeLiveEmail, sendNewEntryAdminEmail } from '@/lib/email'
import { getCategoryBySlug, CATEGORY_NOMINEE_CAP } from '@/lib/content/categories'
import { siteConfig } from '@/config/site'

const slugify = (input: string) =>
  input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)

const firstSentence = (text: string) => {
  const trimmed = text.trim()
  const match = trimmed.match(/^.*?[.!?](\s|$)/)
  return (match ? match[0] : trimmed).trim().slice(0, 140)
}

export interface ApplicationPayload {
  fullName: string
  age: string
  sex: string
  maritalStatus: string
  businessName: string
  businessAddress: string
  staffStrength: string
  annualTurnover: string
  instagramHandle: string
  twitterHandle: string
  facebookHandle: string
  whatsappNumber: string
  alternativeNumber: string
  categorySlug: string
  statement: string
  photoUrl?: string
}

type Result =
  | { ok: true; applicationId: string; slug: string; votingUrl: string }
  | { ok: false; error: string; needsAuth?: true; categoryFull?: true }

export async function submitApplicationAction(payload: ApplicationPayload): Promise<Result> {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: 'Sign in to submit an application.', needsAuth: true }
  }

  const service = createSupabaseServiceClient()

  // One entry per account/email; a second submission would create a duplicate card.
  const { data: existingEntries } = await service
    .from('applications')
    .select('id')
    .eq('applicant_id', user.id)
    .limit(1)
  if (existingEntries && existingEntries.length > 0) {
    return {
      ok: false,
      error:
        'This account has already entered. Each email can submit one entry. Open your dashboard to share your voting link.',
    }
  }

  // Each category holds at most four nominees. Entries already live are kept;
  // once a category is full, new registrations are turned away.
  const { count: categoryCount } = await service
    .from('nominees')
    .select('id', { count: 'exact', head: true })
    .eq('category_slug', payload.categorySlug)
  if ((categoryCount ?? 0) >= CATEGORY_NOMINEE_CAP) {
    return {
      ok: false,
      error: 'Numbers of nominees reached for this category, select another category',
      categoryFull: true,
    }
  }

  const ageNum = Number.parseInt(payload.age, 10)
  const staffNum = Number.parseInt(payload.staffStrength, 10)

  if (!payload.fullName.trim() || !payload.businessName.trim() || !payload.categorySlug) {
    return { ok: false, error: 'Some required fields are missing.' }
  }

  if (Number.isNaN(ageNum) || ageNum < 13 || ageNum > 80) {
    return { ok: false, error: 'Enter a valid age between 13 and 80.' }
  }

  const instagram = payload.instagramHandle.trim()
  const twitter = payload.twitterHandle.trim()
  const facebook = payload.facebookHandle.trim()

  if (!instagram && !twitter && !facebook) {
    return { ok: false, error: 'Add at least one social media handle.' }
  }

  const combinedSocial = [
    instagram ? `Instagram: ${instagram}` : null,
    twitter ? `X: ${twitter}` : null,
    facebook ? `Facebook: ${facebook}` : null,
  ]
    .filter(Boolean)
    .join(' · ')

  const { data, error } = await supabase
    .from('applications')
    .insert({
      applicant_id: user.id,
      full_name: payload.fullName.trim(),
      age: ageNum,
      sex: payload.sex,
      marital_status: payload.maritalStatus,
      business_name: payload.businessName.trim(),
      business_address: payload.businessAddress.trim() || null,
      staff_strength: Number.isNaN(staffNum) ? null : staffNum,
      annual_turnover: payload.annualTurnover.trim() || null,
      social_media_id: combinedSocial,
      whatsapp_number: payload.whatsappNumber.trim(),
      alternative_number: payload.alternativeNumber.trim() || null,
      email: user.email!,
      category_slug: payload.categorySlug,
      statement: payload.statement.trim(),
      headshot_url: payload.photoUrl?.trim() || null,
    })
    .select('id')
    .single()

  if (!error) {
    await supabase
      .from('profiles')
      .update({
        full_name: payload.fullName.trim(),
        phone: payload.whatsappNumber.trim(),
        avatar_url: payload.photoUrl?.trim() || null,
        instagram_handle: instagram || null,
        twitter_handle: twitter || null,
        facebook_handle: facebook || null,
        business_name: payload.businessName.trim() || null,
        business_address: payload.businessAddress.trim() || null,
      })
      .eq('id', user.id)
  }

  if (error) {
    return { ok: false, error: error.message }
  }

  // Going live is instant: every submission publishes a public, votable profile.
  const baseSlug = slugify(`${payload.fullName}-${payload.businessName}`) || `nominee-${Date.now()}`
  let slug = baseSlug
  for (let attempt = 1; attempt < 6; attempt += 1) {
    const { data: clash } = await service
      .from('nominees')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()
    if (!clash) break
    slug = `${baseSlug}-${attempt + 1}`
  }

  const { error: nomineeError } = await service.from('nominees').insert({
    application_id: data.id,
    slug,
    full_name: payload.fullName.trim(),
    business_name: payload.businessName.trim(),
    category_slug: payload.categorySlug,
    headline: firstSentence(payload.statement),
    bio: payload.statement.trim(),
    headshot_url: payload.photoUrl?.trim() || null,
    is_published: true,
  })
  if (nomineeError) {
    return { ok: false, error: nomineeError.message }
  }

  await service
    .from('applications')
    .update({ status: 'approved', reviewed_at: new Date().toISOString() })
    .eq('id', data.id)

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? siteConfig.url
  const votingUrl = `${baseUrl}/nominees/${slug}`
  const category = getCategoryBySlug(payload.categorySlug)
  try {
    await sendNomineeLiveEmail({
      to: user.email!,
      applicantName: payload.fullName.trim(),
      categoryName: category?.name ?? payload.categorySlug,
      votingUrl,
      ballotUrl: `${baseUrl}/nominees#nominee-${slug}`,
    })
  } catch (mailError) {
    console.error('[email] nominee live failed:', mailError)
  }

  try {
    const { data: adminProfiles } = await service.from('profiles').select('id').eq('role', 'admin')
    const {
      data: { users: allUsers },
    } = await service.auth.admin.listUsers({ perPage: 1000 })
    const emailById = new Map(allUsers.map(entry => [entry.id, entry.email]))
    const adminEmails = (adminProfiles ?? [])
      .map(profile => emailById.get(profile.id))
      .filter((address): address is string => Boolean(address))

    await sendNewEntryAdminEmail({
      to: adminEmails,
      applicantName: payload.fullName.trim(),
      businessName: payload.businessName.trim(),
      categoryName: category?.name ?? payload.categorySlug,
      applicantEmail: user.email!,
      whatsappNumber: payload.whatsappNumber.trim(),
      profileUrl: votingUrl,
      adminUrl: `${baseUrl}/admin/nominees`,
    })
  } catch (mailError) {
    console.error('[email] admin new entry alert failed:', mailError)
  }

  revalidatePath('/dashboard')
  revalidatePath('/nominees')
  return { ok: true, applicationId: data.id, slug, votingUrl }
}

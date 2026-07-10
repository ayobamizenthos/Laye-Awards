import { cache } from 'react'
import type { Nominee } from '@/types'
import { createSupabasePublicClient } from '@/lib/supabase/server'
import { CATEGORY_NOMINEE_CAP } from '@/lib/content/categories'

export const getFullCategorySlugs = cache(async (): Promise<string[]> => {
  const supabase = createSupabasePublicClient()
  const { data } = await supabase.from('nominees').select('category_slug').eq('is_published', true)
  if (!data) return []
  const counts = new Map<string, number>()
  for (const row of data) counts.set(row.category_slug, (counts.get(row.category_slug) ?? 0) + 1)
  return [...counts.entries()]
    .filter(([, count]) => count >= CATEGORY_NOMINEE_CAP)
    .map(([slug]) => slug)
})

interface NomineeRow {
  id: string
  slug: string
  full_name: string
  business_name: string
  category_slug: string
  industry: string | null
  headline: string
  bio: string
  headshot_url: string
  total_votes: number
  is_published: boolean
}

const rowToNominee = (row: NomineeRow): Nominee => ({
  id: row.id,
  slug: row.slug,
  fullName: row.full_name,
  businessName: row.business_name,
  categorySlug: row.category_slug,
  industry: row.industry ?? '',
  headline: row.headline,
  bio: row.bio,
  headshotUrl: row.headshot_url,
  voteCount: row.total_votes,
  status: 'approved',
  yearsOperating: 0,
})

const SELECT =
  'id, slug, full_name, business_name, category_slug, industry, headline, bio, headshot_url, total_votes, is_published'

export const getAllNominees = cache(async (): Promise<Nominee[]> => {
  const supabase = createSupabasePublicClient()
  const { data, error } = await supabase
    .from('nominees')
    .select(SELECT)
    .eq('is_published', true)
    .order('total_votes', { ascending: false })
    .order('full_name', { ascending: true })

  if (error || !data) return []
  return data.map(rowToNominee)
})

export const getNomineeBySlug = cache(async (slug: string): Promise<Nominee | null> => {
  const supabase = createSupabasePublicClient()
  const { data, error } = await supabase
    .from('nominees')
    .select(SELECT)
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()

  if (error || !data) return null
  return rowToNominee(data)
})

export const getNomineesByCategory = cache(async (categorySlug: string): Promise<Nominee[]> => {
  const supabase = createSupabasePublicClient()
  const { data, error } = await supabase
    .from('nominees')
    .select(SELECT)
    .eq('category_slug', categorySlug)
    .eq('is_published', true)
    .order('total_votes', { ascending: false })

  if (error || !data) return []
  return data.map(rowToNominee)
})

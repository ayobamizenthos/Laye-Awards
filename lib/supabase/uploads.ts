'use server'

import { createSupabaseServiceClient } from '@/lib/supabase/server'

const MAX_BYTES = 10 * 1024 * 1024
const ACCEPTED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])

type TicketResult = { ok: true; signedUrl: string; url: string } | { ok: false; error: string }

export async function createImageUploadTicket(
  fileName: string,
  contentType: string,
  size: number
): Promise<TicketResult> {
  if (!size) return { ok: false, error: 'Empty file.' }
  if (size > MAX_BYTES) return { ok: false, error: 'Image must be 10 MB or smaller.' }
  if (!ACCEPTED.has(contentType)) {
    return { ok: false, error: 'Use a JPG, PNG, WEBP or AVIF image.' }
  }

  const extension = fileName.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`

  const service = createSupabaseServiceClient()
  const { data, error } = await service.storage.from('nominees').createSignedUploadUrl(path)
  if (error || !data) {
    return { ok: false, error: error?.message ?? 'Could not start the upload.' }
  }

  const { data: published } = service.storage.from('nominees').getPublicUrl(path)
  return { ok: true, signedUrl: data.signedUrl, url: published.publicUrl }
}

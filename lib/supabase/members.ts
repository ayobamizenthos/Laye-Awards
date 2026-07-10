'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'

type ActionResult = { ok: true } | { ok: false; error: string }

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
  return { ok: true as const, userId: user.id }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function createMemberAction(formData: FormData): Promise<ActionResult> {
  const guard = await requireAdmin()
  if (!guard.ok) return { ok: false, error: guard.error }

  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase()
  const password = String(formData.get('password') ?? '')
  const fullName = String(formData.get('fullName') ?? '').trim()
  const role = String(formData.get('role') ?? 'applicant').trim()

  if (!EMAIL_RE.test(email)) return { ok: false, error: 'Enter a valid email.' }
  if (password.length < 8) return { ok: false, error: 'Password must be at least 8 characters.' }
  if (!fullName) return { ok: false, error: 'Enter a full name.' }
  if (role !== 'admin' && role !== 'applicant') return { ok: false, error: 'Invalid role.' }

  const service = createSupabaseServiceClient()
  const { data: created, error: createError } = await service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  })
  if (createError || !created.user) {
    return { ok: false, error: createError?.message ?? 'Could not create the account.' }
  }

  const { error: profileError } = await service
    .from('profiles')
    .upsert({ id: created.user.id, full_name: fullName, role }, { onConflict: 'id' })
  if (profileError) {
    await service.auth.admin.deleteUser(created.user.id)
    return { ok: false, error: profileError.message }
  }

  revalidatePath('/admin/members')
  return { ok: true }
}

export async function deleteMemberAction(memberId: string): Promise<ActionResult> {
  const guard = await requireAdmin()
  if (!guard.ok) return { ok: false, error: guard.error }
  if (memberId === guard.userId) {
    return { ok: false, error: 'You cannot delete your own account.' }
  }

  const service = createSupabaseServiceClient()
  const { error } = await service.auth.admin.deleteUser(memberId)
  if (error) return { ok: false, error: error.message }

  revalidatePath('/admin/members')
  return { ok: true }
}

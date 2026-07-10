'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

type Result = { ok: true } | { ok: false; error: string }
type SignUpResult = { ok: true; needsConfirmation: boolean } | { ok: false; error: string }

export async function signUpAction(formData: FormData): Promise<SignUpResult> {
  const fullName = String(formData.get('fullName') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const confirm = String(formData.get('confirm') ?? '')

  if (!fullName || !email || !phone || !password) {
    return { ok: false, error: 'Fill in every field to continue.' }
  }
  if (password.length < 8) {
    return { ok: false, error: 'Password must be at least 8 characters.' }
  }
  if (password !== confirm) {
    return { ok: false, error: 'Passwords do not match.' }
  }

  const supabase = await createSupabaseServerClient()
  const requestedRedirect = String(formData.get('redirectTo') ?? '').trim()
  const safePath = requestedRedirect.startsWith('/') ? requestedRedirect : '/dashboard'
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, phone },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? ''}${safePath}`,
    },
  })

  if (error) return { ok: false, error: error.message }
  // When email confirmation is off, Supabase returns an active session, the
  // applicant is signed in immediately and can submit without checking email.
  return { ok: true, needsConfirmation: !data.session }
}

export async function signInAction(formData: FormData): Promise<Result> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) return { ok: false, error: 'Enter your email and password.' }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { ok: false, error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function updateProfileAction(formData: FormData): Promise<Result> {
  const fullName = String(formData.get('fullName') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const avatarUrl = String(formData.get('avatarUrl') ?? '').trim()
  const instagram = String(formData.get('instagram') ?? '').trim()
  const twitter = String(formData.get('twitter') ?? '').trim()
  const facebook = String(formData.get('facebook') ?? '').trim()
  const businessName = String(formData.get('businessName') ?? '').trim()
  const businessAddress = String(formData.get('businessAddress') ?? '').trim()

  if (!fullName) return { ok: false, error: 'Full name is required.' }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Sign in to update your profile.' }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      phone: phone || null,
      avatar_url: avatarUrl || null,
      instagram_handle: instagram || null,
      twitter_handle: twitter || null,
      facebook_handle: facebook || null,
      business_name: businessName || null,
      business_address: businessAddress || null,
    })
    .eq('id', user.id)

  if (error) return { ok: false, error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/profile')
  return { ok: true }
}

export async function resetPasswordAction(formData: FormData): Promise<Result> {
  const email = String(formData.get('email') ?? '').trim()
  if (!email) return { ok: false, error: 'Enter your account email.' }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/login`,
  })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

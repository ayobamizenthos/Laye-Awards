'use server'

import { sendContactMessageEmail } from '@/lib/email'

interface ContactPayload {
  name: string
  email: string
  subject: string
  message: string
}

type Result = { ok: true } | { ok: false; error: string }

export async function sendContactEnquiryAction(payload: ContactPayload): Promise<Result> {
  const name = payload.name.trim()
  const email = payload.email.trim()
  const subject = payload.subject.trim()
  const message = payload.message.trim()

  if (!name || !email || !subject || !message) {
    return { ok: false, error: 'Fill in every field to send your message.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Enter a valid email address.' }
  }
  if (message.length > 4000) {
    return { ok: false, error: 'Message is too long. Keep it under 4000 characters.' }
  }

  try {
    await sendContactMessageEmail({ name, email, subject, message })
  } catch (error) {
    console.error('[contact] send failed:', error)
    return { ok: false, error: 'We could not send your message. Please try again shortly.' }
  }

  return { ok: true }
}

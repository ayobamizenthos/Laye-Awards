import { createHmac, timingSafeEqual } from 'node:crypto'

const PAYSTACK_API = 'https://api.paystack.co'

interface InitializeArgs {
  email: string
  amountKobo: number
  callbackUrl: string
  metadata: Record<string, unknown>
  reference?: string
}

interface InitializeResponse {
  authorization_url: string
  access_code: string
  reference: string
}

export async function initializePaystackTransaction(
  args: InitializeArgs
): Promise<InitializeResponse> {
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) throw new Error('PAYSTACK_SECRET_KEY missing.')

  const response = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: args.email,
      amount: args.amountKobo,
      callback_url: args.callbackUrl,
      metadata: args.metadata,
      reference: args.reference,
    }),
  })

  const payload = (await response.json()) as {
    status: boolean
    message: string
    data?: InitializeResponse
  }

  if (!response.ok || !payload.status || !payload.data) {
    throw new Error(payload.message || 'Failed to initialize Paystack transaction.')
  }

  return payload.data
}

interface VerifyResponse {
  status: string
  reference: string
  amount: number
  customer: { email: string }
  metadata: Record<string, unknown> | null
}

export async function verifyPaystackTransaction(reference: string): Promise<VerifyResponse> {
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) throw new Error('PAYSTACK_SECRET_KEY missing.')

  const response = await fetch(
    `${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${secret}` },
      cache: 'no-store',
    }
  )

  const payload = (await response.json()) as {
    status: boolean
    message: string
    data?: VerifyResponse
  }

  if (!response.ok || !payload.status || !payload.data) {
    throw new Error(payload.message || 'Failed to verify Paystack transaction.')
  }
  return payload.data
}

export function verifyPaystackSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret || !signature) return false
  const expected = createHmac('sha512', secret).update(rawBody).digest('hex')
  const a = Buffer.from(expected, 'utf8')
  const b = Buffer.from(signature, 'utf8')
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

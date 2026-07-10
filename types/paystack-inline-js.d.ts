declare module '@paystack/inline-js' {
  interface PaystackTransaction {
    reference: string
    status?: string
    trans?: string
    transaction?: string
    message?: string
    [key: string]: unknown
  }

  interface TransactionCallbacks {
    onSuccess?: (transaction: PaystackTransaction) => void
    onLoad?: (response: unknown) => void
    onCancel?: () => void
    onError?: (error: unknown) => void
  }

  export default class PaystackPop {
    resumeTransaction(accessCode: string, callbacks?: TransactionCallbacks): void
    newTransaction(options: Record<string, unknown> & TransactionCallbacks): void
  }
}

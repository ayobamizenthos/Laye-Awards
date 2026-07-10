'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { deleteMemberAction } from '@/lib/supabase/members'

export function DeleteMemberButton({ memberId, name }: { memberId: string; name: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    setError(null)
    startTransition(async () => {
      const result = await deleteMemberAction(memberId)
      if (!result.ok) {
        setError(result.error)
        return
      }
      router.push('/admin/members')
      router.refresh()
    })
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint transition-colors duration-200 hover:border-red-500/40 hover:text-red-300"
      >
        <Trash2 className="size-4" strokeWidth={1.75} />
        Delete account
      </button>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/[0.05] p-4">
      <p className="text-sm text-red-100">
        Permanently delete {name}&apos;s account and all their data?
      </p>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="rounded-full bg-red-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-red-100 transition-colors hover:bg-red-500/30 disabled:opacity-60"
      >
        {isPending ? 'Deleting…' : 'Yes, delete'}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint hover:text-ink-soft"
      >
        Cancel
      </button>
      {error && <p className="w-full text-xs text-red-300">{error}</p>}
    </div>
  )
}

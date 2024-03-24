import MoveTo from '@/components/pkm/forms/MoveTo'
import { getCurrentVoidItemForUser } from '@/repositories/void'
import { getSuiteDashboardForUser } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type VoidViewRouteParams = {
  params: {
    suiteId: string
    voidItemId: string
    historyItemId: string
  }
}

export default async function VoidViewRoute({
  params: { suiteId, voidItemId, historyItemId },
}: VoidViewRouteParams) {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  const suite = await getSuiteDashboardForUser(suiteId, user.id)

  if (!suite) {
    return redirect('/')
  }

  const voidVoidHistoryItem = await getCurrentVoidItemForUser(
    suiteId,
    voidItemId,
    historyItemId,
    user.id,
  )

  if (
    !voidVoidHistoryItem ||
    !voidVoidHistoryItem.suite ||
    !voidVoidHistoryItem.void_item
  ) {
    return redirect('/')
  }

  return (
    <div className="">
      <div className="text-5xl mb-4">View Void Item</div>
      <div className="w-full mb-4">
        <div className="mb-4">
          <label>
            <div className="mb-4">Name</div>
            <input
              type="text"
              className="min-w-full bg-slate-800 p-4"
              name="name"
              defaultValue={voidVoidHistoryItem.void_item.name}
              readOnly
            />
          </label>
        </div>
        <div className="mb-4">
          <label>
            <div className="mb-4">Summary</div>
            <textarea
              className="min-w-full min-h-48 bg-slate-800 p-4"
              name="summary"
              defaultValue={voidVoidHistoryItem.void_item.summary}
              readOnly
            />
          </label>
        </div>
        <div className="mb-4">
          <label>
            <div className="mb-4">Content</div>
            <div
              dangerouslySetInnerHTML={{
                __html: voidVoidHistoryItem.void_item.content,
              }}
            />
          </label>
        </div>
        <Link
          href={`/suite/${suiteId}/void/edit/${voidItemId}/${historyItemId}`}
        >
          <button
            className="border-solid border-2 border-blue-600 hover:bg-blue-600 px-4 py-2 rounded-lg mr-4"
            type="button"
          >
            Edit
          </button>
        </Link>
      </div>
      <MoveTo
        suiteId={suiteId}
        modelItemId={voidItemId}
        historyItemId={historyItemId}
      />
    </div>
  )
}

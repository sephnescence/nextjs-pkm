import MoveTo from '@/components/pkm/forms/MoveTo'
import { getCurrentTrashItemForUser } from '@/repositories/trash'
import { getSuiteDashboardForUser } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type TrashViewRouteParams = {
  params: {
    suiteId: string
    storeyId: string
    trashItemId: string
    historyItemId: string
  }
}

export default async function TrashViewRoute({
  params: { suiteId, storeyId, trashItemId, historyItemId },
}: TrashViewRouteParams) {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  const suite = await getSuiteDashboardForUser(suiteId, user.id)

  if (!suite) {
    return redirect('/')
  }

  const trashTrashHistoryItem = await getCurrentTrashItemForUser({
    suiteId,
    storeyId,
    spaceId: null, // Storey Trash items won't have a spaceId
    trashItemId,
    historyItemId,
    userId: user.id,
  })

  if (!trashTrashHistoryItem || !trashTrashHistoryItem.trash_item) {
    return redirect('/')
  }

  return (
    <div className="">
      <div className="text-4xl mb-2">View Trash Item</div>
      <div className="w-full mb-4">
        <div className="mb-4">
          <label>
            <div className="mb-4">Name</div>
            <input
              type="text"
              className="min-w-full bg-slate-800 p-4"
              name="name"
              defaultValue={trashTrashHistoryItem.trash_item.name}
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
              defaultValue={trashTrashHistoryItem.trash_item.summary}
              readOnly
            />
          </label>
        </div>
        <div className="mb-4">
          <label>
            <div className="mb-4">Content</div>
            <div
              dangerouslySetInnerHTML={{
                __html: trashTrashHistoryItem.trash_item.content,
              }}
            />
          </label>
        </div>
        <Link
          href={`/suite/${suiteId}/storey/${storeyId}/dashboard/trash/edit/${trashItemId}/${historyItemId}`}
        >
          <button
            className="border-solid border-2 border-blue-600 hover:bg-blue-600 px-4 py-2 rounded-lg mr-4"
            type="button"
          >
            Edit
          </button>
        </Link>
        <Link href={`/suite/${suiteId}/storey/${storeyId}/dashboard?tab=trash`}>
          <button
            className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg mr-4"
            type="button"
          >
            Cancel
          </button>
        </Link>
      </div>
      <MoveTo
        suiteId={suiteId}
        modelItemId={trashItemId}
        historyItemId={historyItemId}
      />
    </div>
  )
}

import MoveTo from '@/components/pkm/forms/MoveTo'
import { getCurrentEpiphanyItemForUser } from '@/repositories/epiphany'
import { getSuiteDashboardForUser } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type EpiphanyViewRouteParams = {
  params: {
    suiteId: string
    storeyId: string
    epiphanyItemId: string
    historyItemId: string
  }
}

export default async function EpiphanyViewRoute({
  params: { suiteId, storeyId, epiphanyItemId, historyItemId },
}: EpiphanyViewRouteParams) {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  const suite = await getSuiteDashboardForUser(suiteId, user.id)

  if (!suite) {
    return redirect('/')
  }

  const epiphanyEpiphanyHistoryItem = await getCurrentEpiphanyItemForUser({
    suiteId,
    storeyId,
    spaceId: null, // Storey Epiphany items won't have a spaceId
    epiphanyItemId,
    historyItemId,
    userId: user.id,
  })

  if (
    !epiphanyEpiphanyHistoryItem ||
    !epiphanyEpiphanyHistoryItem.epiphany_item
  ) {
    return redirect('/')
  }

  return (
    <div className="">
      <div className="text-4xl mb-2">View Epiphany Item</div>
      <div className="w-full mb-4">
        <div className="mb-4">
          <label>
            <div className="mb-4">Name</div>
            <input
              type="text"
              className="min-w-full bg-slate-800 p-4"
              name="name"
              defaultValue={epiphanyEpiphanyHistoryItem.epiphany_item.name}
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
              defaultValue={epiphanyEpiphanyHistoryItem.epiphany_item.summary}
              readOnly
            />
          </label>
        </div>
        <div className="mb-4">
          <label>
            <div className="mb-4">Content</div>
            <div
              dangerouslySetInnerHTML={{
                __html: epiphanyEpiphanyHistoryItem.epiphany_item.content,
              }}
            />
          </label>
        </div>
        <Link
          href={`/suite/${suiteId}/storey/${storeyId}/dashboard/epiphany/edit/${epiphanyItemId}/${historyItemId}`}
        >
          <button
            className="border-solid border-2 border-blue-600 hover:bg-blue-600 px-4 py-2 rounded-lg mr-4"
            type="button"
          >
            Edit
          </button>
        </Link>
        <Link
          href={`/suite/${suiteId}/storey/${storeyId}/dashboard?tab=epiphany`}
        >
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
        modelItemId={epiphanyItemId}
        historyItemId={historyItemId}
      />
    </div>
  )
}

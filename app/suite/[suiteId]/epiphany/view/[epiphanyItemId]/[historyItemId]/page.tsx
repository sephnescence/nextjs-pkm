import MoveTo from '@/components/pkm/forms/MoveTo'
import { getCurrentEpiphanyItemForUser } from '@/repositories/epiphany'
import { getSuiteDashboardForUser } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type EpiphanyViewRouteParams = {
  params: {
    suiteId: string
    epiphanyItemId: string
    historyItemId: string
  }
}

export default async function EpiphanyViewRoute({
  params: { suiteId, epiphanyItemId, historyItemId },
}: EpiphanyViewRouteParams) {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  const suite = await getSuiteDashboardForUser(suiteId, user.id)

  if (!suite) {
    return redirect('/')
  }

  const epiphanyEpiphanyHistoryItem = await getCurrentEpiphanyItemForUser(
    suiteId,
    epiphanyItemId,
    historyItemId,
    user.id,
  )

  if (
    !epiphanyEpiphanyHistoryItem ||
    !epiphanyEpiphanyHistoryItem.suite ||
    !epiphanyEpiphanyHistoryItem.epiphany_item
  ) {
    return redirect('/')
  }

  return (
    <div className="">
      <div className="text-5xl mb-4">View Epiphany Item</div>
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
            <input
              type="text"
              className="min-w-full bg-slate-800 p-4"
              name="summary"
              defaultValue={epiphanyEpiphanyHistoryItem.epiphany_item.summary}
              readOnly
            />
          </label>
        </div>
        <div className="mb-4">
          <label>
            <div className="mb-4">Content</div>
            <textarea
              className="min-w-full min-h-96 bg-slate-800 p-4"
              name="content"
              defaultValue={epiphanyEpiphanyHistoryItem.epiphany_item.content}
              readOnly
            />
          </label>
        </div>
        <Link
          href={`/suite/${suiteId}/epiphany/edit/${epiphanyItemId}/${historyItemId}`}
        >
          <button
            className="border-solid border-2 border-blue-600 hover:bg-blue-600 px-4 py-2 rounded-lg mr-4"
            type="button"
          >
            Edit
          </button>
        </Link>
      </div>
      <MoveTo modelItemId={epiphanyItemId} historyItemId={historyItemId} />
    </div>
  )
}

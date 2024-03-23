import MoveTo from '@/components/pkm/forms/MoveTo'
import { getCurrentPassingThoughtItemForUser } from '@/repositories/passingThought'
import { getSuiteDashboardForUser } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type PassingThoughtViewRouteParams = {
  params: {
    suiteId: string
    passingThoughtItemId: string
    historyItemId: string
  }
}

export default async function PassingThoughtViewRoute({
  params: { suiteId, passingThoughtItemId, historyItemId },
}: PassingThoughtViewRouteParams) {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  const suite = await getSuiteDashboardForUser(suiteId, user.id)

  if (!suite) {
    return redirect('/')
  }

  const passingThoughtHistoryItem = await getCurrentPassingThoughtItemForUser(
    suiteId,
    passingThoughtItemId,
    historyItemId,
    user.id,
  )

  if (
    !passingThoughtHistoryItem ||
    !passingThoughtHistoryItem.suite ||
    !passingThoughtHistoryItem.passing_thought_item
  ) {
    return redirect('/')
  }

  return (
    <div className="">
      <div className="text-5xl mb-4">View Passing Thought Item</div>
      <div className="w-full mb-4">
        <div className="mb-4">
          <label>
            <div className="mb-4">Name</div>
            <input
              type="text"
              className="min-w-full bg-slate-800 p-4"
              name="name"
              defaultValue={passingThoughtHistoryItem.passing_thought_item.name}
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
              defaultValue={
                passingThoughtHistoryItem.passing_thought_item.summary
              }
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
              defaultValue={
                passingThoughtHistoryItem.passing_thought_item.content
              }
              readOnly
            />
          </label>
        </div>
        <Link
          href={`/suite/${suiteId}/passing-thought/edit/${passingThoughtItemId}/${historyItemId}`}
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
        modelItemId={passingThoughtItemId}
        historyItemId={historyItemId}
      />
    </div>
  )
}

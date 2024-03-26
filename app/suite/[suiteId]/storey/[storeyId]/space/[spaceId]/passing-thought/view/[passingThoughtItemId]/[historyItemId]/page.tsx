import MoveTo from '@/components/pkm/forms/MoveTo'
import { getCurrentPassingThoughtItemForUser } from '@/repositories/passingThought'
import { getSuiteDashboardForUser } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type PassingThoughtViewRouteParams = {
  params: {
    suiteId: string
    storeyId: string
    spaceId: string
    passingThoughtItemId: string
    historyItemId: string
  }
}

export default async function PassingThoughtViewRoute({
  params: { suiteId, storeyId, spaceId, passingThoughtItemId, historyItemId },
}: PassingThoughtViewRouteParams) {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  const suite = await getSuiteDashboardForUser(suiteId, user.id)

  if (!suite) {
    return redirect('/')
  }

  const passingThoughtPassingThoughtHistoryItem =
    await getCurrentPassingThoughtItemForUser({
      suiteId: null, // Space Passing Thought items won't actually have a suiteId, but the url will
      storeyId,
      spaceId,
      passingThoughtItemId,
      historyItemId,
      userId: user.id,
    })

  if (
    !passingThoughtPassingThoughtHistoryItem ||
    !passingThoughtPassingThoughtHistoryItem.passing_thought_item
  ) {
    return redirect('/')
  }

  return (
    <div className="">
      <div className="text-4xl mb-2">View PassingThought Item</div>
      <div className="w-full mb-4">
        <div className="mb-4">
          <label>
            <div className="mb-4">Name</div>
            <input
              type="text"
              className="min-w-full bg-slate-800 p-4"
              name="name"
              defaultValue={
                passingThoughtPassingThoughtHistoryItem.passing_thought_item
                  .name
              }
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
              defaultValue={
                passingThoughtPassingThoughtHistoryItem.passing_thought_item
                  .summary
              }
              readOnly
            />
          </label>
        </div>
        <div className="mb-4">
          <label>
            <div className="mb-4">Content</div>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  passingThoughtPassingThoughtHistoryItem.passing_thought_item
                    .content,
              }}
            />
          </label>
        </div>
        <Link
          href={`/suite/${suiteId}/storey/${storeyId}/space/${spaceId}/passing-thought/edit/${passingThoughtItemId}/${historyItemId}`}
        >
          <button
            className="border-solid border-2 border-blue-600 hover:bg-blue-600 px-4 py-2 rounded-lg mr-4"
            type="button"
          >
            Edit
          </button>
        </Link>

        <Link
          href={`/suite/${suiteId}/storey/${storeyId}/space/${spaceId}?tab=passing-thought`}
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
        modelItemId={passingThoughtItemId}
        historyItemId={historyItemId}
      />
    </div>
  )
}

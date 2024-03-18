import { getCurrentEpiphanyItemForUser } from '@/repositories/epiphany'
import { getUserAuth } from '@/utils/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type EpiphanyViewRouteParams = {
  params: {
    epiphanyItemId: string
    historyItemId: string
  }
}

export default async function EpiphanyViewRoute({
  params: { epiphanyItemId, historyItemId },
}: EpiphanyViewRouteParams) {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  const epiphanyItem = await getCurrentEpiphanyItemForUser(
    epiphanyItemId,
    historyItemId,
    user.id,
  )

  if (!epiphanyItem) {
    return redirect('/')
  }

  return (
    <div className="mx-4 my-4">
      <div className="text-5xl mb-4">View Epiphany Item</div>
      <div className="w-full">
        <div className="mb-4">
          <label>
            <div className="mb-4">Name</div>
            <input
              type="text"
              className="min-w-full bg-slate-800 p-4"
              name="name"
              defaultValue={epiphanyItem.name}
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
              defaultValue={epiphanyItem.summary}
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
              defaultValue={epiphanyItem.content}
              readOnly
            />
          </label>
        </div>
        <Link
          href={`/dashboard/epiphany/edit/${epiphanyItemId}/${historyItemId}`}
        >
          <button
            className="border-solid border-2 border-blue-600 hover:bg-blue-600 px-4 py-2 rounded-lg mr-4"
            type="button"
          >
            Edit
          </button>
        </Link>
      </div>
    </div>
  )
}

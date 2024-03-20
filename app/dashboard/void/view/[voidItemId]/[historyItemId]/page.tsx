import MoveTo from '@/components/pkm/forms/MoveTo'
import { getCurrentVoidItemForUser } from '@/repositories/void'
import { getUserAuth } from '@/utils/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type VoidViewRouteParams = {
  params: {
    voidItemId: string
    historyItemId: string
  }
}

export default async function VoidViewRoute({
  params: { voidItemId, historyItemId },
}: VoidViewRouteParams) {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  const voidItem = await getCurrentVoidItemForUser(
    voidItemId,
    historyItemId,
    user.id,
  )

  if (!voidItem) {
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
              defaultValue={voidItem.name}
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
              defaultValue={voidItem.summary}
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
              defaultValue={voidItem.content}
              readOnly
            />
          </label>
        </div>
        <Link href={`/dashboard/void/edit/${voidItemId}/${historyItemId}`}>
          <button
            className="border-solid border-2 border-blue-600 hover:bg-blue-600 px-4 py-2 rounded-lg mr-4"
            type="button"
          >
            Edit
          </button>
        </Link>
      </div>
      <MoveTo modelItemId={voidItemId} historyItemId={historyItemId} />
    </div>
  )
}

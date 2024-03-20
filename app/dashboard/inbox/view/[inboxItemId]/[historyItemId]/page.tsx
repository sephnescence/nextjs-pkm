import MoveTo from '@/components/pkm/forms/MoveTo'
import { getCurrentInboxItemForUser } from '@/repositories/inbox'
import { getUserAuth } from '@/utils/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type InboxViewRouteParams = {
  params: {
    inboxItemId: string
    historyItemId: string
  }
}

export default async function InboxViewRoute({
  params: { inboxItemId, historyItemId },
}: InboxViewRouteParams) {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  const inboxItem = await getCurrentInboxItemForUser(
    inboxItemId,
    historyItemId,
    user.id,
  )

  if (!inboxItem) {
    return redirect('/')
  }

  return (
    <div className="">
      <div className="text-5xl mb-4">View Inbox Item</div>
      <div className="w-full mb-4">
        <div className="mb-4">
          <label>
            <div className="mb-4">Name</div>
            <input
              type="text"
              className="min-w-full bg-slate-800 p-4"
              name="name"
              defaultValue={inboxItem.name}
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
              defaultValue={inboxItem.summary}
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
              defaultValue={inboxItem.content}
              readOnly
            />
          </label>
        </div>
        <Link href={`/dashboard/inbox/edit/${inboxItemId}/${historyItemId}`}>
          <button
            className="border-solid border-2 border-blue-600 hover:bg-blue-600 px-4 py-2 rounded-lg mr-4"
            type="button"
          >
            Edit
          </button>
        </Link>
      </div>
      <MoveTo modelItemId={inboxItemId} historyItemId={historyItemId} />
    </div>
  )
}

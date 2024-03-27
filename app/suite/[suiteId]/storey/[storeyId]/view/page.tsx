import { getStoreyForUser } from '@/repositories/storey'
import { getUserAuth } from '@/utils/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type SuiteViewRouteParams = {
  params: {
    suiteId: string
    storeyId: string
  }
}

export default async function SuiteViewRoute({
  params: { suiteId, storeyId },
}: SuiteViewRouteParams) {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  const storey = await getStoreyForUser(suiteId, storeyId, user.id)

  if (!storey) {
    return redirect('/')
  }

  return (
    <div className="">
      <div className="text-4xl mb-2">View Storey</div>
      <div className="w-full mb-4">
        <div className="mb-4">
          <label>
            <div className="mb-4">Name</div>
            <input
              type="text"
              className="min-w-full bg-slate-800 p-4"
              name="name"
              defaultValue={storey.name}
              readOnly
            />
          </label>
        </div>
        <div className="mb-4">
          <label>
            <div className="mb-4">Description</div>
            <textarea
              className="min-w-full min-h-48 bg-slate-800 p-4"
              name="description"
              defaultValue={storey.description}
              readOnly
            />
          </label>
        </div>
        <div className="mb-4">
          <label>
            <div className="mb-4">Content</div>
            <div
              dangerouslySetInnerHTML={{
                __html: storey.content,
              }}
            />
          </label>
        </div>
        <Link href={`/suite/${suiteId}/edit`}>
          <button
            className="border-solid border-2 border-blue-600 hover:bg-blue-600 px-4 py-2 rounded-lg mr-4"
            type="button"
          >
            Edit
          </button>
        </Link>
        <Link href={`/suite/${suiteId}/storey/${storeyId}`}>
          <button
            className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg mr-4"
            type="button"
          >
            Cancel
          </button>
        </Link>
      </div>
    </div>
  )
}

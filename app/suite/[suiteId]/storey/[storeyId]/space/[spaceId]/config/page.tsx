import { getSpaceForUser } from '@/repositories/space'
import { getStoreyForUser } from '@/repositories/storey'
import { getSuiteForUser } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type SpaceViewRouteParams = {
  params: {
    suiteId: string
    storeyId: string
    spaceId: string
  }
}

export default async function SpaceViewRoute({
  params: { suiteId, storeyId, spaceId },
}: SpaceViewRouteParams) {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  const suite = await getSuiteForUser(suiteId, user.id)

  if (!suite) {
    return redirect('/')
  }

  const storey = await getStoreyForUser(suiteId, storeyId, user.id)

  if (!storey) {
    return redirect('/')
  }

  const space = await getSpaceForUser(storeyId, spaceId, user.id)

  if (!space) {
    return redirect('/')
  }

  return (
    <div className="">
      <div className="text-4xl mb-2">View Space</div>
      <div className="w-full mb-4">
        <div className="mb-4">
          <label>
            <div className="mb-4">Name</div>
            <input
              type="text"
              className="min-w-full bg-slate-800 p-4"
              name="name"
              defaultValue={space.name}
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
              defaultValue={space.description}
              readOnly
            />
          </label>
        </div>
        <div className="mb-4">
          <label>
            <div className="mb-4">Content</div>
            <div
              dangerouslySetInnerHTML={{
                __html: space.content,
              }}
            />
          </label>
        </div>
        <Link
          href={`/suite/${suiteId}/storey/${storeyId}/space/${spaceId}/config/edit`}
        >
          <button
            className="border-solid border-2 border-blue-600 hover:bg-blue-600 px-4 py-2 rounded-lg mr-4"
            type="button"
          >
            Edit
          </button>
        </Link>
        <Link
          href={`/suite/${suiteId}/storey/${storeyId}/space/${spaceId}/dashboard`}
        >
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

import { getSuiteForUser } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type SuiteViewRouteParams = {
  params: {
    suiteId: string
  }
}

export default async function SuiteViewRoute({
  params: { suiteId },
}: SuiteViewRouteParams) {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  const suite = await getSuiteForUser(suiteId, user.id)

  if (!suite) {
    return redirect('/')
  }

  return (
    <div className="">
      <div className="text-5xl mb-4">View Suite</div>
      <div className="w-full mb-4">
        <div className="mb-4">
          <label>
            <div className="mb-4">Name</div>
            <input
              type="text"
              className="min-w-full bg-slate-800 p-4"
              name="name"
              defaultValue={suite.name}
              readOnly
            />
          </label>
        </div>
        <div className="mb-4">
          <label>
            <div className="mb-4">Description</div>
            <input
              type="text"
              className="min-w-full bg-slate-800 p-4"
              name="summary"
              defaultValue={suite.description}
              readOnly
            />
          </label>
        </div>
        <Link href={`/suite/edit/${suiteId}`}>
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
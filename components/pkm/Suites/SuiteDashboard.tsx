import Link from 'next/link'
import SuiteTile from './forms/SuiteTile'
import { getSuiteDashboard } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import { redirect } from 'next/navigation'

const SuiteDashboard = async () => {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  const suiteDashboard = await getSuiteDashboard(user.id)

  return (
    <>
      <div className="ml-1 mb-2">
        <Link href="/suites/create">
          <button
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg mr-4"
            type="button"
          >
            Create
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {suiteDashboard.map((suite) => {
          return (
            <div key={suite.id}>
              <SuiteTile
                id={suite.id}
                name={suite.name}
                description={suite.description}
              />
            </div>
          )
        })}
      </div>
    </>
  )
}

export default SuiteDashboard

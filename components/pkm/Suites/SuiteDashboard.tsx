'use server'

import Link from 'next/link'
import SuiteTile from './forms/SuiteTile'
import { getSuitesForUser } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import { redirect } from 'next/navigation'
import BuildingOffice2Icon from '@/components/icons/BuildingOffice2Icon'
import PlusIcon from '@/components/icons/PlusIcon'

const SuiteDashboard = async () => {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  const suiteDashboard = await getSuitesForUser(user.id)

  return (
    <>
      <div className="h-8 mb-2 ml-1">
        <div className="relative">
          <div className="absolute top-0 left-0 flex">
            <div className="bg-indigo-900 h-8 mr-2 py-1 px-3 rounded-lg hover:ring-1 hover:ring-indigo-500">
              <Link
                className="flex rounded-lg focus:outline-offset-1 focus:outline-lime-600"
                href={`/suite/config/new`}
              >
                <BuildingOffice2Icon />
                <PlusIcon viewBox="6 -3 12 48" className="w-2 h-6" />
              </Link>
            </div>
          </div>
        </div>
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

import { getSuitesForUser } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const SuitesSidenav = async () => {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  const suiteDashboard = await getSuitesForUser(user.id)

  return (
    <>
      <div className="">
        <div className="text-xl">
          <Link href={'/suites'}>Suites</Link>
        </div>
        <ul>
          {suiteDashboard.map((suite) => {
            return <li key={suite.id}>{suite.name}</li>
          })}
        </ul>
      </div>
    </>
  )
}

export default SuitesSidenav

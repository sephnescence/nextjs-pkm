import Breadcrumbs from '@/components/nav/Breadcrumbs'
import { getSuiteDashboardForUser } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import { redirect } from 'next/navigation'

const SuiteLayout = async ({
  children,
  params: { suiteId },
}: {
  children: React.ReactNode
  params: {
    suiteId: string
  }
}) => {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  const suite = await getSuiteDashboardForUser(suiteId, user.id)

  if (!suite) {
    return redirect('/')
  }

  return (
    <>
      <Breadcrumbs suiteId={suiteId} suiteName={suite.name} />
      {children}
    </>
  )
}

export default SuiteLayout

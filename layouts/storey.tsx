import StoreyBreadcrumbs from '@/components/nav/StoreyBreadcrumbs'
import { getStoreyDashboardForUser } from '@/repositories/storey'
import { getUserAuth } from '@/utils/auth'
import { redirect } from 'next/navigation'

const SuiteLayout = async ({
  children,
  params: { suiteId, storeyId },
}: {
  children: React.ReactNode
  params: {
    suiteId: string
    storeyId: string
  }
}) => {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  const storey = await getStoreyDashboardForUser(suiteId, storeyId, user.id)

  if (!storey) {
    return redirect('/')
  }

  return (
    <>
      <StoreyBreadcrumbs
        suiteId={storey.suite.id}
        suiteName={storey.suite.name}
        storeyId={storey.id}
        storeyName={storey.name}
      />
      {children}
    </>
  )
}

export default SuiteLayout

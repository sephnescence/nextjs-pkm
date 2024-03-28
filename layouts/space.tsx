import Breadcrumbs from '@/components/nav/Breadcrumbs'
import { getSpaceDashboardForUser } from '@/repositories/space'
import { getUserAuth } from '@/utils/auth'
import { redirect } from 'next/navigation'

const SpaceLayout = async ({
  children,
  params: { storeyId, spaceId },
}: {
  children: React.ReactNode
  params: {
    storeyId: string
    spaceId: string
  }
}) => {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  const space = await getSpaceDashboardForUser(storeyId, spaceId, user.id)

  if (!space) {
    return redirect('/')
  }

  return (
    <>
      <Breadcrumbs
        suiteId={space.storey.suite.id}
        suiteName={space.storey.suite.name}
        storeyId={space.storey.id}
        storeyName={space.storey.name}
        spaceId={space.id}
        spaceName={space.name}
      />
      {children}
    </>
  )
}

export default SpaceLayout

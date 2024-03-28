'use server'

import Breadcrumbs from '@/components/nav/Breadcrumbs'
import { getSpaceDashboardForUser } from '@/repositories/space'
import { getUserAuth } from '@/utils/auth'
import { redirect } from 'next/navigation'

const SpaceLayout = async ({
  children,
  params: { suiteId, storeyId, spaceId },
}: {
  children: React.ReactNode
  params: {
    suiteId: string
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
        suiteId={suiteId}
        suiteName={space.storey.suite.name}
        storeyId={storeyId}
        storeyName={space.storey.name}
        spaceId={spaceId}
        spaceName={space.name}
      />
      {children}
    </>
  )
}

export default SpaceLayout

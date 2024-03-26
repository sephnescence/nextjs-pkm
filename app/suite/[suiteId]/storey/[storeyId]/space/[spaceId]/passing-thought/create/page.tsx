'use server'

import ItemForm from '@/components/pkm/forms/ItemForm'
import { getSpaceDashboardForUser } from '@/repositories/space'
import { getStoreyDashboardForUser } from '@/repositories/storey'
import { getSuiteDashboardForUser } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import { redirect } from 'next/navigation'

const SuitePassingThoughtCreateRoute = async ({
  params: { suiteId, storeyId, spaceId },
}: {
  params: { suiteId: string; storeyId: string; spaceId: string }
}) => {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  const suite = await getSuiteDashboardForUser(suiteId, user.id)

  if (!suite) {
    return redirect('/')
  }

  const storey = await getStoreyDashboardForUser(suiteId, storeyId, user.id)

  if (!storey) {
    return redirect('/')
  }

  const space = await getSpaceDashboardForUser(storeyId, spaceId, user.id)

  if (!space) {
    return redirect('/')
  }

  return (
    <ItemForm
      cancelUrl={`/suite/${suiteId}/storey/${storeyId}/space/${spaceId}?tab=passing-thought`}
      apiEndpoint={`/api/suite/${suiteId}/storey/${storeyId}/space/${spaceId}/passing_thought`}
      apiMethod="POST"
      pageTitle="New Passing Thought Item"
    />
  )
}

export default SuitePassingThoughtCreateRoute

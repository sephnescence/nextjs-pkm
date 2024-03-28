'use server'

import ItemForm from '@/components/pkm/forms/ItemForm'
import { getStoreyDashboardForUser } from '@/repositories/storey'
import { getSuiteDashboardForUser } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import { redirect } from 'next/navigation'

const SuiteVoidCreateRoute = async ({
  params: { suiteId, storeyId },
}: {
  params: { suiteId: string; storeyId: string }
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

  return (
    <ItemForm
      cancelUrl={`/suite/${suiteId}/storey/${storeyId}/dashboard?tab=void`}
      apiEndpoint={`/api/suite/${suiteId}/storey/${storeyId}/void`}
      apiMethod="POST"
      pageTitle="New Void Item"
    />
  )
}

export default SuiteVoidCreateRoute

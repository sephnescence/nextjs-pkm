'use server'

import ItemForm from '@/components/pkm/forms/ItemForm'
import { getStoreyDashboardForUser } from '@/repositories/storey'
import { getSuiteDashboardForUser } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import { redirect } from 'next/navigation'

const SuiteTrashCreateRoute = async ({
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
      cancelUrl={`/suite/${suiteId}/storey/${storeyId}?tab=trash`}
      apiEndpoint={`/api/suite/${suiteId}/storey/${storeyId}/trash`}
      apiMethod="POST"
      pageTitle="New Trash Item"
    />
  )
}

export default SuiteTrashCreateRoute

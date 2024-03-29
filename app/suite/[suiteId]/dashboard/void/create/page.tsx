'use server'

import ItemForm from '@/components/pkm/forms/ItemForm'
import { getSuiteDashboardForUser } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import { redirect } from 'next/navigation'

const SuiteVoidCreateRoute = async ({
  params: { suiteId },
}: {
  params: { suiteId: string }
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
    <ItemForm
      cancelUrl={`/suite/${suiteId}/dashboard?tab=void`}
      apiEndpoint={`/api/suite/${suiteId}/void`}
      apiMethod="POST"
      pageTitle="New Void Item"
    />
  )
}

export default SuiteVoidCreateRoute

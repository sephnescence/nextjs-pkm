'use server'

import ItemForm from '@/components/pkm/forms/ItemForm'
import { getSuiteDashboardForUser } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import { redirect } from 'next/navigation'

const SuiteEpiphanyCreateRoute = async ({
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
      cancelUrl={`/suite/${suiteId}`}
      apiEndpoint={`/api/suite/${suiteId}/epiphany`}
      apiMethod="POST"
      pageTitle="New Epiphany Item"
    />
  )
}

export default SuiteEpiphanyCreateRoute

'use client'

import SuiteForm from '@/components/pkm/Suites/forms/SuiteForm'

const SpaceCreateRoute = ({
  params: { suiteId, storeyId },
}: {
  params: { suiteId: string; storeyId: string }
}) => {
  return (
    <SuiteForm
      pageTitle="Configure New Space"
      cancelUrl={`/suite/${suiteId}/storey/${storeyId}/dashboard`}
      apiEndpoint={`/api/suite/${suiteId}/storey/${storeyId}`}
      apiMethod="POST"
    />
  )
}

export default SpaceCreateRoute

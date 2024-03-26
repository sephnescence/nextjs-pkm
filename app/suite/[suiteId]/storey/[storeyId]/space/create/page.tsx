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
      cancelUrl={`/suite/${suiteId}/storey/${storeyId}/view`}
      apiEndpoint={`/api/suite/${suiteId}/storey/${storeyId}/space`}
      apiMethod="POST"
    />
  )
}

export default SpaceCreateRoute

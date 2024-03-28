'use client'

import SuiteForm from '@/components/pkm/Suites/forms/SuiteForm'

const StoreyCreateRoute = ({
  params: { suiteId },
}: {
  params: { suiteId: string }
}) => {
  return (
    <SuiteForm
      pageTitle="Configure New Storey"
      apiEndpoint={`/api/suite/${suiteId}`}
      apiMethod="POST"
    />
  )
}

export default StoreyCreateRoute

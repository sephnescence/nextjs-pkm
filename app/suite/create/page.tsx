'use client'

import SuiteForm from '@/components/pkm/Suites/forms/SuiteForm'

const SuiteCreateRoute = () => {
  return (
    <SuiteForm
      pageTitle="Configure New Suite"
      cancelUrl="/suites"
      apiEndpoint={`/api/suite`}
      apiMethod="POST"
    />
  )
}

export default SuiteCreateRoute

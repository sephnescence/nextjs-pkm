'use client'

import SuiteForm from '@/components/pkm/Suites/forms/SuiteForm'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type SuiteEditRouteParams = {
  params: {
    suiteId: string
  }
}

type SuiteViewResponse = {
  success: boolean
  suite: {
    name: string
    description: string
    content: string
  }
  errors?: {
    fieldErrors?: {
      general?: string
      content?: string
    }
  }
  redirect?: string
}

export default function SuiteEditRoute({
  params: { suiteId },
}: SuiteEditRouteParams) {
  const router = useRouter()
  const [resJson, setResJon] = useState<SuiteViewResponse | null>(() => null)

  useEffect(() => {
    fetch(
      new Request(`/api/suite/${suiteId}`, {
        method: 'GET',
      }),
    )
      .then(async (res) => res.text())
      .then(async (resText) => JSON.parse(resText))
      .then(async (resJson) => {
        setResJon(resJson)
      })
      .catch(() => {})
  }, [setResJon, suiteId])

  if (resJson === null) {
    return <div>Loading...</div>
  }

  if (resJson.success === false) {
    return router.replace(resJson.redirect || '/')
  }

  if (resJson.success && resJson.redirect) {
    return router.push(resJson.redirect)
  }

  return (
    <SuiteForm
      pageTitle="Edit Suite Configuration"
      cancelUrl={`/suite/${suiteId}/dashboard`}
      apiEndpoint={`/api/suite/${suiteId}`}
      apiMethod="PATCH"
      defaultName={resJson.suite.name}
      defaultDescription={resJson.suite.description}
      defaultContent={resJson.suite.content}
    />
  )
}

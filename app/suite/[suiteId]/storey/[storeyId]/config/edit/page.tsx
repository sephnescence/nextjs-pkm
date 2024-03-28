'use client'

import SuiteForm from '@/components/pkm/Suites/forms/SuiteForm'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type StoreyEditRouteParams = {
  params: {
    suiteId: string
    storeyId: string
  }
}

type StoreyViewResponse = {
  success: boolean
  suite: {
    name: string
    description: string
    content: string
  }
  storey: {
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

export default function StoreyEditRoute({
  params: { suiteId, storeyId },
}: StoreyEditRouteParams) {
  const router = useRouter()
  const [resJson, setResJon] = useState<StoreyViewResponse | null>(() => null)

  useEffect(() => {
    fetch(
      new Request(`/api/suite/${suiteId}/storey/${storeyId}`, {
        method: 'GET',
      }),
    )
      .then(async (res) => res.text())
      .then(async (resText) => JSON.parse(resText))
      .then(async (resJson) => {
        setResJon(resJson)
      })
      .catch(() => {})
  }, [setResJon, suiteId, storeyId])

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
      pageTitle="Edit Storey Configuration"
      cancelUrl={`/suite/${suiteId}/storey/${storeyId}/dashboard`}
      apiEndpoint={`/api/suite/${suiteId}/storey/${storeyId}`}
      apiMethod="PATCH"
      defaultName={resJson.suite.name}
      defaultDescription={resJson.suite.description}
      defaultContent={resJson.suite.content}
    />
  )
}

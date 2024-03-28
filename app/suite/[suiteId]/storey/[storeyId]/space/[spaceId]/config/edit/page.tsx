'use client'

import SuiteForm from '@/components/pkm/Suites/forms/SuiteForm'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type SpaceEditRouteParams = {
  params: {
    suiteId: string
    storeyId: string
    spaceId: string
  }
}

type SpaceViewResponse = {
  success: boolean
  space: {
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

export default function SpaceEditRoute({
  params: { suiteId, storeyId, spaceId },
}: SpaceEditRouteParams) {
  const router = useRouter()
  const [resJson, setResJon] = useState<SpaceViewResponse | null>(() => null)

  useEffect(() => {
    fetch(
      new Request(`/api/suite/${suiteId}/storey/${storeyId}/space/${spaceId}`, {
        method: 'GET',
      }),
    )
      .then(async (res) => res.text())
      .then(async (resText) => JSON.parse(resText))
      .then(async (resJson) => {
        setResJon(resJson)
      })
      .catch(() => {})
  }, [setResJon, suiteId, storeyId, spaceId])

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
      pageTitle="Edit Space Configuration"
      cancelUrl={`/suite/${suiteId}/storey/${storeyId}/space/${spaceId}/dashboard`}
      apiEndpoint={`/api/suite/${suiteId}/storey/${storeyId}/space/${spaceId}`}
      apiMethod="PATCH"
      defaultName={resJson.space.name}
      defaultDescription={resJson.space.description}
      defaultContent={resJson.space.content}
    />
  )
}

'use client'

import ItemForm from '@/components/pkm/forms/ItemForm'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type PassingThoughtEditRouteParams = {
  params: {
    suiteId: string
    storeyId: string
    spaceId: string
    passingThoughtItemId: string
    historyItemId: string
  }
}

type PassingThoughtViewResponse = {
  success: boolean
  passingThoughtItem: {
    content: string
    name: string
    summary: string
  }
  suite: {
    id: string
    name: string
    description: string
  }
  errors?: {
    fieldErrors?: {
      general?: string
      content?: string
    }
  }
  redirect?: string
}

export default function PassingThoughtEditRoute({
  params: { suiteId, storeyId, spaceId, passingThoughtItemId, historyItemId },
}: PassingThoughtEditRouteParams) {
  const router = useRouter()
  const [resJson, setResJon] = useState<PassingThoughtViewResponse | null>(
    () => null,
  )

  useEffect(() => {
    fetch(
      new Request(
        `/api/suite/${suiteId}/storey/${storeyId}/space/${spaceId}/dashboard/passing-thought/${passingThoughtItemId}/${historyItemId}`,
        {
          method: 'GET',
        },
      ),
    )
      .then(async (res) => res.text())
      .then(async (resText) => JSON.parse(resText))
      .then(async (resJson) => {
        setResJon(resJson)
      })
      .catch(() => {})
  }, [
    setResJon,
    suiteId,
    storeyId,
    spaceId,
    passingThoughtItemId,
    historyItemId,
  ])

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
    <>
      <ItemForm
        pageTitle="Edit Passing Thought Item"
        cancelUrl={`/suite/${suiteId}/storey/${storeyId}/space/${spaceId}/dashboard/passing-thought/view/${passingThoughtItemId}/${historyItemId}`}
        apiEndpoint={`/api/suite/${suiteId}/storey/${storeyId}/space/${spaceId}/dashboard/passing-thought/${passingThoughtItemId}/${historyItemId}`}
        apiMethod="PATCH"
        defaultContent={resJson.passingThoughtItem.content}
        defaultName={resJson.passingThoughtItem.name}
        defaultSummary={resJson.passingThoughtItem.summary}
      />
    </>
  )
}

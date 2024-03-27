'use client'

import ItemForm from '@/components/pkm/forms/ItemForm'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type VoidEditRouteParams = {
  params: {
    suiteId: string
    storeyId: string
    voidItemId: string
    historyItemId: string
  }
}

type VoidViewResponse = {
  success: boolean
  voidItem: {
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

export default function VoidEditRoute({
  params: { suiteId, storeyId, voidItemId, historyItemId },
}: VoidEditRouteParams) {
  const router = useRouter()
  const [resJson, setResJon] = useState<VoidViewResponse | null>(() => null)

  useEffect(() => {
    fetch(
      new Request(
        `/api/suite/${suiteId}/storey/${storeyId}/void/${voidItemId}/${historyItemId}`,
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
  }, [setResJon, suiteId, storeyId, voidItemId, historyItemId])

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
        pageTitle="Edit Void Item"
        cancelUrl={`/suite/${suiteId}/storey/${storeyId}/void/view/${voidItemId}/${historyItemId}`}
        apiEndpoint={`/api/suite/${suiteId}/storey/${storeyId}/void/${voidItemId}/${historyItemId}`}
        apiMethod="PATCH"
        defaultContent={resJson.voidItem.content}
        defaultName={resJson.voidItem.name}
        defaultSummary={resJson.voidItem.summary}
      />
    </>
  )
}

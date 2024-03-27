'use client'

import ItemForm from '@/components/pkm/forms/ItemForm'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type EpiphanyEditRouteParams = {
  params: {
    suiteId: string
    storeyId: string
    spaceId: string
    epiphanyItemId: string
    historyItemId: string
  }
}

type EpiphanyViewResponse = {
  success: boolean
  epiphanyItem: {
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

export default function EpiphanyEditRoute({
  params: { suiteId, storeyId, epiphanyItemId, historyItemId },
}: EpiphanyEditRouteParams) {
  const router = useRouter()
  const [resJson, setResJon] = useState<EpiphanyViewResponse | null>(() => null)

  useEffect(() => {
    fetch(
      new Request(
        `/api/suite/${suiteId}/storey/${storeyId}/epiphany/${epiphanyItemId}/${historyItemId}`,
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
  }, [setResJon, suiteId, storeyId, epiphanyItemId, historyItemId])

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
        pageTitle="Edit Epiphany Item"
        cancelUrl={`/suite/${suiteId}/storey/${storeyId}/view`}
        apiEndpoint={`/api/suite/${suiteId}/storey/${storeyId}/epiphany/${epiphanyItemId}/${historyItemId}`}
        apiMethod="PATCH"
        defaultContent={resJson.epiphanyItem.content}
        defaultName={resJson.epiphanyItem.name}
        defaultSummary={resJson.epiphanyItem.summary}
      />
    </>
  )
}

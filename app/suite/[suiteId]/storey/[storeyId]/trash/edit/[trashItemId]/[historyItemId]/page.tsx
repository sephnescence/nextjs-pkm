'use client'

import ItemForm from '@/components/pkm/forms/ItemForm'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type TrashEditRouteParams = {
  params: {
    suiteId: string
    storeyId: string
    trashItemId: string
    historyItemId: string
  }
}

type TrashViewResponse = {
  success: boolean
  trashItem: {
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

export default function TrashEditRoute({
  params: { suiteId, storeyId, trashItemId, historyItemId },
}: TrashEditRouteParams) {
  const router = useRouter()
  const [resJson, setResJon] = useState<TrashViewResponse | null>(() => null)

  useEffect(() => {
    fetch(
      new Request(
        `/api/suite/${suiteId}/storey/${storeyId}/trash/${trashItemId}/${historyItemId}`,
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
  }, [setResJon, suiteId, storeyId, trashItemId, historyItemId])

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
        pageTitle="Edit Trash Item"
        cancelUrl={`/suite/${suiteId}/storey/${storeyId}/view`}
        apiEndpoint={`/api/suite/${suiteId}/storey/${storeyId}/trash/${trashItemId}/${historyItemId}`}
        apiMethod="PATCH"
        defaultContent={resJson.trashItem.content}
        defaultName={resJson.trashItem.name}
        defaultSummary={resJson.trashItem.summary}
      />
    </>
  )
}

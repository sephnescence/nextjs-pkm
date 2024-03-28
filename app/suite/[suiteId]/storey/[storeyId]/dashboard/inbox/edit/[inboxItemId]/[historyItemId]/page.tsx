'use client'

import ItemForm from '@/components/pkm/forms/ItemForm'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type InboxEditRouteParams = {
  params: {
    suiteId: string
    storeyId: string
    inboxItemId: string
    historyItemId: string
  }
}

type InboxViewResponse = {
  success: boolean
  inboxItem: {
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

export default function InboxEditRoute({
  params: { suiteId, storeyId, inboxItemId, historyItemId },
}: InboxEditRouteParams) {
  const router = useRouter()
  const [resJson, setResJon] = useState<InboxViewResponse | null>(() => null)

  useEffect(() => {
    fetch(
      new Request(
        `/api/suite/${suiteId}/storey/${storeyId}/dashboard/inbox/${inboxItemId}/${historyItemId}`,
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
  }, [setResJon, suiteId, storeyId, inboxItemId, historyItemId])

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
        pageTitle="Edit Inbox Item"
        cancelUrl={`/suite/${suiteId}/storey/${storeyId}/dashboard/inbox/view/${inboxItemId}/${historyItemId}`}
        apiEndpoint={`/api/suite/${suiteId}/storey/${storeyId}/dashboard/inbox/${inboxItemId}/${historyItemId}`}
        apiMethod="PATCH"
        defaultContent={resJson.inboxItem.content}
        defaultName={resJson.inboxItem.name}
        defaultSummary={resJson.inboxItem.summary}
      />
    </>
  )
}

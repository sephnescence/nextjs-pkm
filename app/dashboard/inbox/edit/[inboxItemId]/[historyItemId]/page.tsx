'use client'

import IndexForm from '@/components/pkm/forms/IndexForm'
import MoveTo from '@/components/pkm/forms/MoveTo'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type InboxEditRouteParams = {
  params: {
    inboxItemId: string
    historyItemId: string
  }
}

type InboxViewResponse = {
  success: boolean
  inboxItem: {
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

export default function InboxEditRoute({
  params: { inboxItemId, historyItemId },
}: InboxEditRouteParams) {
  const router = useRouter()
  const [resJson, setResJon] = useState<InboxViewResponse | null>(() => null)

  useEffect(() => {
    fetch(
      new Request(`/api/inbox/${inboxItemId}/${historyItemId}`, {
        method: 'GET',
      }),
    )
      .then(async (res) => res.text())
      .then((resText) => JSON.parse(resText))
      .then((resJson) => {
        setResJon(resJson)
      })
      .catch(() => {})
  }, [setResJon, inboxItemId, historyItemId])

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
      <IndexForm
        pageTitle="Edit Inbox Item"
        apiEndpoint={`/api/inbox/${inboxItemId}/${historyItemId}`}
        apiMethod="PATCH"
        defaultContent={resJson.inboxItem.content}
      />
      <MoveTo modelItemId={inboxItemId} historyItemId={historyItemId} />
    </>
  )
}

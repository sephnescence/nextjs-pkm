'use client'

import IndexForm from '@/components/pkm/forms/IndexForm'
import MoveTo from '@/components/pkm/forms/MoveTo'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type TrashEditRouteParams = {
  params: {
    trashItemId: string
    historyItemId: string
  }
}

type TrashViewResponse = {
  success: boolean
  trashItem: {
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

export default function TrashEditRoute({
  params: { trashItemId, historyItemId },
}: TrashEditRouteParams) {
  const router = useRouter()
  const [resJson, setResJon] = useState<TrashViewResponse | null>(() => null)

  useEffect(() => {
    fetch(
      new Request(`/api/trash/${trashItemId}/${historyItemId}`, {
        method: 'GET',
      }),
    )
      .then(async (res) => res.text())
      .then((resText) => JSON.parse(resText))
      .then((resJson) => {
        setResJon(resJson)
      })
      .catch(() => {})
  }, [setResJon, trashItemId, historyItemId])

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
        pageTitle="Edit Trash Item"
        apiEndpoint={`/api/trash/${trashItemId}/${historyItemId}`}
        apiMethod="PATCH"
        defaultContent={resJson.trashItem.content}
      />
      <MoveTo modelItemId={trashItemId} historyItemId={historyItemId} />
    </>
  )
}

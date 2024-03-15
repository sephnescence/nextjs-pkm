'use client'

import IndexForm from '@/components/pkm/forms/IndexForm'
import MoveTo from '@/components/pkm/forms/MoveTo'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type VoidEditRouteParams = {
  params: {
    voidItemId: string
    historyItemId: string
  }
}

type VoidViewResponse = {
  success: boolean
  voidItem: {
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

export default function VoidEditRoute({
  params: { voidItemId, historyItemId },
}: VoidEditRouteParams) {
  const router = useRouter()
  const [resJson, setResJon] = useState<VoidViewResponse | null>(() => null)

  useEffect(() => {
    fetch(
      new Request(`/api/void/${voidItemId}/${historyItemId}`, {
        method: 'GET',
      }),
    )
      .then(async (res) => res.text())
      .then((resText) => JSON.parse(resText))
      .then((resJson) => {
        setResJon(resJson)
      })
      .catch(() => {})
  }, [setResJon, voidItemId, historyItemId])

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
        pageTitle="Edit Void Item"
        apiEndpoint={`/api/void/${voidItemId}/${historyItemId}`}
        apiMethod="PATCH"
        defaultContent={resJson.voidItem.content}
      />
      <MoveTo modelItemId={voidItemId} historyItemId={historyItemId} />
    </>
  )
}

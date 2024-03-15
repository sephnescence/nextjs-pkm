'use client'

import IndexForm from '@/components/pkm/forms/IndexForm'
import MoveTo from '@/components/pkm/forms/MoveTo'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type EpiphanyEditRouteParams = {
  params: {
    epiphanyItemId: string
    historyItemId: string
  }
}

type EpiphanyViewResponse = {
  success: boolean
  epiphanyItem: {
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

export default function EpiphanyEditRoute({
  params: { epiphanyItemId, historyItemId },
}: EpiphanyEditRouteParams) {
  const router = useRouter()
  const [resJson, setResJon] = useState<EpiphanyViewResponse | null>(() => null)

  useEffect(() => {
    fetch(
      new Request(`/api/epiphany/${epiphanyItemId}/${historyItemId}`, {
        method: 'GET',
      }),
    )
      .then(async (res) => res.text())
      .then(async (resText) => JSON.parse(resText))
      .then(async (resJson) => {
        setResJon(resJson)
      })
      .catch(() => {})
  }, [setResJon, epiphanyItemId, historyItemId])

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
        pageTitle="Edit Epiphany Item"
        apiEndpoint={`/api/epiphany/${epiphanyItemId}/${historyItemId}`}
        apiMethod="PATCH"
        defaultContent={resJson.epiphanyItem.content}
      />
      <MoveTo modelItemId={epiphanyItemId} historyItemId={historyItemId} />
    </>
  )
}

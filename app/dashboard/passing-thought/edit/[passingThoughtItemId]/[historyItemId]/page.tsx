'use client'

import IndexForm from '@/components/pkm/forms/IndexForm'
import MoveTo from '@/components/pkm/forms/MoveTo'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type PassingThoughtEditRouteParams = {
  params: {
    passingThoughtItemId: string
    historyItemId: string
  }
}

type PassingThoughtViewResponse = {
  success: boolean
  passingThoughtItem: {
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

export default function PassingThoughtEditRoute({
  params: { passingThoughtItemId, historyItemId },
}: PassingThoughtEditRouteParams) {
  const router = useRouter()
  const [resJson, setResJon] = useState<PassingThoughtViewResponse | null>(
    () => null,
  )

  useEffect(() => {
    fetch(
      new Request(
        `/api/passing-thought/${passingThoughtItemId}/${historyItemId}`,
        {
          method: 'GET',
        },
      ),
    )
      .then(async (res) => res.text())
      .then((resText) => JSON.parse(resText))
      .then((resJson) => {
        setResJon(resJson)
      })
      .catch(() => {})
  }, [setResJon, passingThoughtItemId, historyItemId])

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
        pageTitle="Edit Passing Thought Item"
        apiEndpoint={`/api/passing-thought/${passingThoughtItemId}/${historyItemId}`}
        apiMethod="PATCH"
        defaultContent={resJson.passingThoughtItem.content}
      />
      <MoveTo
        modelItemId={passingThoughtItemId}
        historyItemId={historyItemId}
      />
    </>
  )
}

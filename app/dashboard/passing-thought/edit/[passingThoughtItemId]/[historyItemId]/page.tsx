'use client'

import ItemForm from '@/components/pkm/forms/ItemForm'
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
    name: string
    summary: string
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
      <ItemForm
        pageTitle="Edit Passing Thought Item"
        apiEndpoint={`/api/passing-thought/${passingThoughtItemId}/${historyItemId}`}
        apiMethod="PATCH"
        defaultContent={resJson.passingThoughtItem.content}
        defaultName={resJson.passingThoughtItem.name}
        defaultSummary={resJson.passingThoughtItem.summary}
      />
      <MoveTo
        modelItemId={passingThoughtItemId}
        historyItemId={historyItemId}
      />
    </>
  )
}

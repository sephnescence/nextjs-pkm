'use client'

import ItemForm from '@/components/pkm/forms/ItemForm'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type TodoEditRouteParams = {
  params: {
    suiteId: string
    storeyId: string
    spaceId: string
    todoItemId: string
    historyItemId: string
  }
}

type TodoViewResponse = {
  success: boolean
  todoItem: {
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

export default function TodoEditRoute({
  params: { suiteId, storeyId, spaceId, todoItemId, historyItemId },
}: TodoEditRouteParams) {
  const router = useRouter()
  const [resJson, setResJon] = useState<TodoViewResponse | null>(() => null)

  useEffect(() => {
    fetch(
      new Request(
        `/api/suite/${suiteId}/storey/${storeyId}/space/${spaceId}/todo/${todoItemId}/${historyItemId}`,
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
  }, [setResJon, suiteId, storeyId, spaceId, todoItemId, historyItemId])

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
        pageTitle="Edit Todo Item"
        cancelUrl={`/suite/${suiteId}/storey/${storeyId}/space/${spaceId}/view`}
        apiEndpoint={`/api/suite/${suiteId}/storey/${storeyId}/space/${spaceId}/todo/${todoItemId}/${historyItemId}`}
        apiMethod="PATCH"
        defaultContent={resJson.todoItem.content}
        defaultName={resJson.todoItem.name}
        defaultSummary={resJson.todoItem.summary}
      />
    </>
  )
}

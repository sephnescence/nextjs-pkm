'use client'

import IndexForm from '@/components/pkm/forms/IndexForm'
import MoveTo from '@/components/pkm/forms/MoveTo'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type TodoEditRouteParams = {
  params: {
    todoItemId: string
    historyItemId: string
  }
}

type TodoViewResponse = {
  success: boolean
  todoItem: {
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

export default function TodoEditRoute({
  params: { todoItemId, historyItemId },
}: TodoEditRouteParams) {
  const router = useRouter()
  const [resJson, setResJon] = useState<TodoViewResponse | null>(() => null)

  useEffect(() => {
    fetch(
      new Request(`/api/todo/${todoItemId}/${historyItemId}`, {
        method: 'GET',
      }),
    )
      .then(async (res) => res.text())
      .then((resText) => JSON.parse(resText))
      .then((resJson) => {
        setResJon(resJson)
      })
      .catch(() => {})
  }, [setResJon, todoItemId, historyItemId])

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
        pageTitle="Edit Todo Item"
        apiEndpoint={`/api/todo/${todoItemId}/${historyItemId}`}
        apiMethod="PATCH"
        defaultContent={resJson.todoItem.content}
      />
      <MoveTo modelItemId={todoItemId} historyItemId={historyItemId} />
    </>
  )
}

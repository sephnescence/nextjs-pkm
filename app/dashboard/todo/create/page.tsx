'use client'

import IndexForm from '@/components/pkm/forms/IndexForm'

export default function TodoCreateRoute() {
  return (
    <IndexForm
      apiEndpoint="/api/todo"
      apiMethod="POST"
      pageTitle="New Todo Item"
    />
  )
}

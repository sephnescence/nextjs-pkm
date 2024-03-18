'use client'

import ItemForm from '@/components/pkm/forms/ItemForm'

export default function TodoCreateRoute() {
  return (
    <ItemForm
      apiEndpoint="/api/todo"
      apiMethod="POST"
      pageTitle="New Todo Item"
    />
  )
}

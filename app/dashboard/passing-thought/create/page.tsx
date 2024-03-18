'use client'

import ItemForm from '@/components/pkm/forms/ItemForm'

export default function PassingThoughtCreateRoute() {
  return (
    <ItemForm
      apiEndpoint="/api/passing-thought"
      apiMethod="POST"
      pageTitle="New Passing Thought Item"
    />
  )
}

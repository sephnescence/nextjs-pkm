'use client'

import ItemForm from '@/components/pkm/forms/ItemForm'

export default function TrashCreateRoute() {
  return (
    <ItemForm
      apiEndpoint="/api/trash"
      apiMethod="POST"
      pageTitle="New Trash Item"
    />
  )
}

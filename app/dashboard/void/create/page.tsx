'use client'

import ItemForm from '@/components/pkm/forms/ItemForm'

export default function VoidCreateRoute() {
  return (
    <ItemForm
      apiEndpoint="/api/void"
      apiMethod="POST"
      pageTitle="New Void Item"
    />
  )
}

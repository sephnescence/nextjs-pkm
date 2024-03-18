'use client'

import ItemForm from '@/components/pkm/forms/ItemForm'

export default function EpiphanyCreateRoute() {
  return (
    <ItemForm
      apiEndpoint="/api/epiphany"
      apiMethod="POST"
      pageTitle="New Epiphany Item"
    />
  )
}

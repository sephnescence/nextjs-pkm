'use client'

import IndexForm from '@/components/pkm/forms/IndexForm'

export default function TrashCreateRoute() {
  return (
    <IndexForm
      apiEndpoint="/api/trash"
      apiMethod="POST"
      pageTitle="New Trash Item"
    />
  )
}

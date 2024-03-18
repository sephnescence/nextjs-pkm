'use client'

import ItemForm from '@/components/pkm/forms/ItemForm'

export default function InboxCreateRoute() {
  return (
    <ItemForm
      apiEndpoint="/api/inbox"
      apiMethod="POST"
      pageTitle="New Inbox Item"
    />
  )
}

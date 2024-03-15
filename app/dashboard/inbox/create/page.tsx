'use client'

import IndexForm from '@/components/pkm/forms/IndexForm'

export default function InboxCreateRoute() {
  return (
    <IndexForm
      apiEndpoint="/api/inbox"
      apiMethod="POST"
      pageTitle="New Inbox Item"
    />
  )
}

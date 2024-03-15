'use client'

import IndexForm from '@/components/pkm/forms/IndexForm'

export default function VoidCreateRoute() {
  return (
    <IndexForm
      apiEndpoint="/api/void"
      apiMethod="POST"
      pageTitle="New Void Item"
    />
  )
}

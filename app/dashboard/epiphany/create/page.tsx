'use client'

import IndexForm from '@/components/pkm/forms/IndexForm'

export default function EpiphanyCreateRoute() {
  return (
    <IndexForm
      apiEndpoint="/api/epiphany"
      apiMethod="POST"
      pageTitle="New Epiphany Item"
    />
  )
}

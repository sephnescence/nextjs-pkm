'use client'

import IndexForm from '@/components/pkm/forms/IndexForm'

export default function PassingThoughtCreateRoute() {
  return (
    <IndexForm
      apiEndpoint="/api/passing-thought"
      apiMethod="POST"
      pageTitle="New Passing Thought Item"
    />
  )
}

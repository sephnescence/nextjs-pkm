'use server'

import SuiteDashboard from '@/components/pkm/Suites/SuiteDashboard'
import { getUserAuth } from '@/utils/auth'
import { redirect } from 'next/navigation'

export default async function SuitesIndex() {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  return (
    <>
      <p className="text-4xl mb-2">Suites</p>
      <div className="text-xl text-white/60 mb-2">
        Review and remodel your suites
      </div>
      <SuiteDashboard />
    </>
  )
}

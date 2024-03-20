'use server'

import SuiteDashboard from '@/components/pkm/Suites/SuiteDashboard'
import { getSuiteDashboard } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import { redirect } from 'next/navigation'

export default async function SuitesIndex() {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  const suiteDashboard = await getSuiteDashboard(user.id)

  return (
    <>
      <p className="text-5xl">Suites</p>
      <div className="mt-4 text-xl text-white/60 mb-4">
        Review and remodel your suites
      </div>
      <SuiteDashboard />
    </>
  )
}

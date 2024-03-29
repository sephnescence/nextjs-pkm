import { getUserAuth } from '@/utils/auth'
import { redirect } from 'next/navigation'

const FoyerRoute = async () => {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  return redirect(
    `/suite/${user.id}/storey/${user.id}/space/${user.id}/dashboard`,
  )
}

export default FoyerRoute

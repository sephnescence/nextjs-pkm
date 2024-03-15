'use server'

import { getUserTrashByClerkId } from '@/repositories/user'
import { getClerkId } from '@/utils/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function TrashIndex() {
  const clerkId = await getClerkId()
  if (!clerkId) {
    return redirect('/')
  }

  const user = await getUserTrashByClerkId(clerkId)

  if (!user || !user.pkm_history) {
    return redirect('/')
  }

  return (
    <div className="mx-4 my-4">
      <p className="text-5xl">Trash</p>
      <div className="mt-4 text-xl text-white/60 mb-4">
        Trashed items can be restored anywhere
      </div>
      <div className="mt-4">
        {user.pkm_history
          .filter((item) => {
            return item.model_type === 'PkmTrash'
          })
          .map((item) => {
            return (
              <div key={item.model_id}>
                <Link
                  className="hover:underline"
                  href={`/dashboard/trash/view/${item.model_id}/${item.history_id}`}
                >
                  {item.trash_item?.content}
                </Link>
              </div>
            )
          })}
      </div>
    </div>
  )
}

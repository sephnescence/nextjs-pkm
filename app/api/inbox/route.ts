'use server'

import { storeInboxItem } from '@/repositories/inbox'
import { getUserAuth } from '@/utils/auth'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export const POST = async (request: Request) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const inboxArgs = (await request.json()) || ''

  if (!inboxArgs.content) {
    return NextResponse.json({
      success: false,
      error: 'Content is required',
    })
  }

  const newInboxItem = await storeInboxItem({
    userId: user.id,
    content: inboxArgs.content,
  })

  if (!newInboxItem) {
    return NextResponse.json({
      success: false,
      errors: {
        fieldErrors: {
          general: 'An unexpected error occurred. Please try again.',
        },
      },
    })
  }

  revalidatePath('/dashboard')

  return NextResponse.json({
    success: true,
    redirect: `/dashboard/inbox/view/${newInboxItem.inboxItem?.model_id}/${newInboxItem.inboxItem?.history_id}`,
  })
}

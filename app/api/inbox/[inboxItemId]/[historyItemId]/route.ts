'use server'

import {
  getCurrentInboxItemForUser,
  updateInboxItem,
} from '@/repositories/inbox'
import { getUserAuth } from '@/utils/auth'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

type InputGetParams = {
  params: {
    historyItemId: string
    inboxItemId: string
  }
}

type InboxPatchParams = {
  params: {
    inboxItemId: string
    historyItemId: string
  }
}

export const GET = async (
  request: Request,
  { params: { inboxItemId, historyItemId } }: InputGetParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingInbox = await getCurrentInboxItemForUser(
    inboxItemId,
    historyItemId,
    user.id,
  )

  if (!existingInbox) {
    return NextResponse.json({
      success: false,
      redirect: '/',
    })
  }

  return NextResponse.json({
    success: true,
    inboxItem: {
      content: existingInbox.content,
    },
  })
}

export const PATCH = async (
  request: Request,
  { params: { inboxItemId, historyItemId } }: InboxPatchParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingInbox = await getCurrentInboxItemForUser(
    inboxItemId,
    historyItemId,
    user.id,
  )

  if (!existingInbox) {
    return NextResponse.json({
      success: false,
      error: 'This is an old inbox item. You cannot edit it.',
    })
  }

  const inboxArgs = (await request.json()) || ''

  if (!inboxArgs.content) {
    return NextResponse.json({
      success: false,
      error: 'Content is required',
    })
  }

  const newInboxItem = await updateInboxItem({
    content: inboxArgs.content,
    historyItemId,
    inboxItemId,
    userId: user.id,
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

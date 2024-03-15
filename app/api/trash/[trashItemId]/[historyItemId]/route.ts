'use server'

import {
  getCurrentTrashItemForUser,
  updateTrashItem,
} from '@/repositories/trash'
import { getUserAuth } from '@/utils/auth'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

type TrashGetParams = {
  params: {
    historyItemId: string
    trashItemId: string
  }
}

type TrashPatchParams = {
  params: {
    trashItemId: string
    historyItemId: string
  }
}

export const GET = async (
  request: Request,
  { params: { trashItemId, historyItemId } }: TrashGetParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingTrash = await getCurrentTrashItemForUser(
    trashItemId,
    historyItemId,
    user.id,
  )

  if (!existingTrash) {
    return NextResponse.json({
      success: false,
      redirect: '/',
    })
  }

  return NextResponse.json({
    success: true,
    trashItem: {
      content: existingTrash.content,
    },
  })
}

export const PATCH = async (
  request: Request,
  { params: { trashItemId, historyItemId } }: TrashPatchParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingTrash = await getCurrentTrashItemForUser(
    trashItemId,
    historyItemId,
    user.id,
  )

  if (!existingTrash) {
    return NextResponse.json({
      success: false,
      error: 'This is an old trash item. You cannot edit it.',
    })
  }

  const trashArgs = (await request.json()) || ''

  if (!trashArgs.content) {
    return NextResponse.json({
      success: false,
      error: 'Content is required',
    })
  }

  const newTrashItem = await updateTrashItem({
    content: trashArgs.content,
    historyItemId,
    trashItemId,
    userId: user.id,
  })

  if (!newTrashItem) {
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
    redirect: `/dashboard/trash/view/${newTrashItem.trashItem?.model_id}/${newTrashItem.trashItem?.history_id}`,
  })
}

'use server'

import {
  getCurrentTrashItemForUser,
  updateTrashItem,
} from '@/repositories/trash'
import { getUserAuth } from '@/utils/auth'
import { NextResponse } from 'next/server'

type TrashGetParams = {
  params: {
    suiteId: string
    historyItemId: string
    trashItemId: string
  }
}

type TrashPatchParams = {
  params: {
    suiteId: string
    trashItemId: string
    historyItemId: string
  }
}

export const GET = async (
  request: Request,
  { params: { suiteId, trashItemId, historyItemId } }: TrashGetParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingTrashHistoryItem = await getCurrentTrashItemForUser({
    suiteId,
    storeyId: null,
    spaceId: null,
    trashItemId,
    historyItemId,
    userId: user.id,
  })

  if (!existingTrashHistoryItem || !existingTrashHistoryItem.trash_item) {
    return NextResponse.json({
      success: false,
      redirect: '/',
    })
  }

  return NextResponse.json({
    success: true,
    suite: existingTrashHistoryItem.suite
      ? {
          id: existingTrashHistoryItem.suite.id,
          name: existingTrashHistoryItem.suite.name,
          description: existingTrashHistoryItem.suite.description,
        }
      : null,
    trashItem: {
      content: existingTrashHistoryItem.trash_item.content,
      name: existingTrashHistoryItem.trash_item.name,
      summary: existingTrashHistoryItem.trash_item.summary,
    },
  })
}

export const PATCH = async (
  request: Request,
  { params: { suiteId, trashItemId, historyItemId } }: TrashPatchParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingTrash = await getCurrentTrashItemForUser({
    suiteId,
    storeyId: null,
    spaceId: null,
    trashItemId,
    historyItemId,
    userId: user.id,
  })

  if (!existingTrash || !existingTrash.suite) {
    return NextResponse.json({
      success: false,
      error: 'This is an old trash item. You cannot edit it.',
    })
  }

  const trashArgs = (await request.json()) || ''

  if (!trashArgs.name) {
    return NextResponse.json({
      success: false,
      errors: {
        fieldErrors: {
          general: 'There were validation errors',
          name: 'Name is required',
        },
      },
    })
  }

  if (!trashArgs.summary) {
    return NextResponse.json({
      success: false,
      errors: {
        fieldErrors: {
          general: 'There were validation errors',
          summary: 'Summary is required',
        },
      },
    })
  }

  if (!trashArgs.content) {
    return NextResponse.json({
      success: false,
      errors: {
        fieldErrors: {
          general: 'There were validation errors',
          content: 'Content is required',
        },
      },
    })
  }

  const newTrashItem = await updateTrashItem({
    content: trashArgs.content,
    name: trashArgs.name,
    summary: trashArgs.summary,
    historyItemId,
    suiteId,
    storeyId: null,
    spaceId: null,
    trashItemId,
    userId: user.id,
  })

  if (!newTrashItem || !newTrashItem.trashItem) {
    return NextResponse.json({
      success: false,
      errors: {
        fieldErrors: {
          general: 'An unexpected error occurred. Please try again.',
        },
      },
    })
  }

  return NextResponse.json({
    success: true,
    redirect: `/suite/${existingTrash.suite.id}/dashboard/trash/view/${newTrashItem.trashItem.model_id}/${newTrashItem.trashItem.history_id}`,
  })
}

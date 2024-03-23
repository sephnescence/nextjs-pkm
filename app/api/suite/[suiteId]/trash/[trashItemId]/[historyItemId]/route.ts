'use server'

import { getCurrentVoidItemForUser, updateVoidItem } from '@/repositories/void'
import { getUserAuth } from '@/utils/auth'
import { NextResponse } from 'next/server'

type VoidGetParams = {
  params: {
    suiteId: string
    historyItemId: string
    voidItemId: string
  }
}

type VoidPatchParams = {
  params: {
    suiteId: string
    voidItemId: string
    historyItemId: string
  }
}

export const GET = async (
  request: Request,
  { params: { suiteId, voidItemId, historyItemId } }: VoidGetParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingVoidHistoryItem = await getCurrentVoidItemForUser(
    suiteId,
    voidItemId,
    historyItemId,
    user.id,
  )

  if (
    !existingVoidHistoryItem ||
    !existingVoidHistoryItem.suite ||
    !existingVoidHistoryItem.void_item
  ) {
    return NextResponse.json({
      success: false,
      redirect: '/',
    })
  }

  return NextResponse.json({
    success: true,
    suite: {
      id: existingVoidHistoryItem.suite.id,
      name: existingVoidHistoryItem.suite.name,
      description: existingVoidHistoryItem.suite.description,
    },
    voidItem: {
      content: existingVoidHistoryItem.void_item.content,
      name: existingVoidHistoryItem.void_item.name,
      summary: existingVoidHistoryItem.void_item.summary,
    },
  })
}

export const PATCH = async (
  request: Request,
  { params: { suiteId, voidItemId, historyItemId } }: VoidPatchParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingVoid = await getCurrentVoidItemForUser(
    suiteId,
    voidItemId,
    historyItemId,
    user.id,
  )

  if (!existingVoid) {
    return NextResponse.json({
      success: false,
      error: 'This is an old void item. You cannot edit it.',
    })
  }

  const voidArgs = (await request.json()) || ''

  if (!voidArgs.name) {
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

  if (!voidArgs.summary) {
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

  if (!voidArgs.content) {
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

  const newVoidItem = await updateVoidItem({
    content: voidArgs.content,
    name: voidArgs.name,
    summary: voidArgs.summary,
    historyItemId,
    suiteId,
    voidItemId,
    userId: user.id,
  })

  if (!newVoidItem) {
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
    redirect: `/suite/${suiteId}/void/view/${newVoidItem.voidItem?.model_id}/${newVoidItem.voidItem?.history_id}`,
  })
}

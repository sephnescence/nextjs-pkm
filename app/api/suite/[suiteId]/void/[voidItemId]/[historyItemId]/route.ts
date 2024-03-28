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

  const existingVoidHistoryItem = await getCurrentVoidItemForUser({
    suiteId,
    storeyId: null,
    spaceId: null,
    voidItemId,
    historyItemId,
    userId: user.id,
  })

  if (!existingVoidHistoryItem || !existingVoidHistoryItem.void_item) {
    return NextResponse.json({
      success: false,
      redirect: '/',
    })
  }

  return NextResponse.json({
    success: true,
    suite: existingVoidHistoryItem.suite
      ? {
          id: existingVoidHistoryItem.suite.id,
          name: existingVoidHistoryItem.suite.name,
          description: existingVoidHistoryItem.suite.description,
        }
      : null,
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

  const existingVoid = await getCurrentVoidItemForUser({
    suiteId,
    storeyId: null,
    spaceId: null,
    voidItemId,
    historyItemId,
    userId: user.id,
  })

  if (!existingVoid || !existingVoid.suite) {
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
    storeyId: null,
    spaceId: null,
    voidItemId,
    userId: user.id,
  })

  if (!newVoidItem || !newVoidItem.voidItem) {
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
    redirect: `/suite/${existingVoid.suite.id}/dashboard/void/view/${newVoidItem.voidItem.model_id}/${newVoidItem.voidItem.history_id}`,
  })
}

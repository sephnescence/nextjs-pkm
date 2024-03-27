'use server'

import { getCurrentVoidItemForUser, updateVoidItem } from '@/repositories/void'
import { getUserAuth } from '@/utils/auth'
import { NextResponse } from 'next/server'

type VoidGetParams = {
  params: {
    suiteId: string
    storeyId: string
    historyItemId: string
    voidItemId: string
  }
}

type VoidPatchParams = {
  params: {
    suiteId: string
    storeyId: string
    voidItemId: string
    historyItemId: string
  }
}

export const GET = async (
  request: Request,
  { params: { suiteId, storeyId, voidItemId, historyItemId } }: VoidGetParams,
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
    storeyId,
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
    suite:
      existingVoidHistoryItem.storey && existingVoidHistoryItem.storey.suite
        ? {
            id: existingVoidHistoryItem.storey.suite.id,
            name: existingVoidHistoryItem.storey.suite.name,
            description: existingVoidHistoryItem.storey.suite.description,
          }
        : null,
    storey: existingVoidHistoryItem.storey
      ? {
          id: existingVoidHistoryItem.storey.id,
          name: existingVoidHistoryItem.storey.name,
          description: existingVoidHistoryItem.storey.description,
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
  { params: { suiteId, storeyId, voidItemId, historyItemId } }: VoidPatchParams,
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
    storeyId,
    spaceId: null,
    voidItemId,
    historyItemId,
    userId: user.id,
  })

  if (!existingVoid || !existingVoid.storey) {
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
    storeyId,
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
    redirect: `/suite/${existingVoid.storey.suite.id}/storey/${storeyId}/void/view/${newVoidItem.voidItem.model_id}/${newVoidItem.voidItem.history_id}`,
  })
}

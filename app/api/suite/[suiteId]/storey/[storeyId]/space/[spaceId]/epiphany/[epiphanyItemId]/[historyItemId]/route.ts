'use server'

import {
  getCurrentEpiphanyItemForUser,
  updateEpiphanyItem,
} from '@/repositories/epiphany'
import { getUserAuth } from '@/utils/auth'
import { NextResponse } from 'next/server'

type EpiphanyGetParams = {
  params: {
    storeyId: string
    spaceId: string
    historyItemId: string
    epiphanyItemId: string
  }
}

type EpiphanyPatchParams = {
  params: {
    storeyId: string
    spaceId: string
    epiphanyItemId: string
    historyItemId: string
  }
}

export const GET = async (
  request: Request,
  {
    params: { storeyId, spaceId, epiphanyItemId, historyItemId },
  }: EpiphanyGetParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingEpiphanyHistoryItem = await getCurrentEpiphanyItemForUser({
    suiteId: null,
    storeyId,
    spaceId,
    epiphanyItemId,
    historyItemId,
    userId: user.id,
  })

  if (
    !existingEpiphanyHistoryItem ||
    !existingEpiphanyHistoryItem.epiphany_item
  ) {
    return NextResponse.json({
      success: false,
      redirect: '/',
    })
  }

  return NextResponse.json({
    success: true,
    suite:
      existingEpiphanyHistoryItem.storey &&
      existingEpiphanyHistoryItem.storey.suite
        ? {
            id: existingEpiphanyHistoryItem.storey.suite.id,
            name: existingEpiphanyHistoryItem.storey.suite.name,
            description: existingEpiphanyHistoryItem.storey.suite.description,
          }
        : null,
    storey: existingEpiphanyHistoryItem.storey
      ? {
          id: existingEpiphanyHistoryItem.storey.id,
          name: existingEpiphanyHistoryItem.storey.name,
          description: existingEpiphanyHistoryItem.storey.description,
        }
      : null,
    space: existingEpiphanyHistoryItem.space
      ? {
          id: existingEpiphanyHistoryItem.space.id,
          name: existingEpiphanyHistoryItem.space.name,
          description: existingEpiphanyHistoryItem.space.description,
        }
      : null,
    epiphanyItem: {
      content: existingEpiphanyHistoryItem.epiphany_item.content,
      name: existingEpiphanyHistoryItem.epiphany_item.name,
      summary: existingEpiphanyHistoryItem.epiphany_item.summary,
    },
  })
}

export const PATCH = async (
  request: Request,
  {
    params: { storeyId, spaceId, epiphanyItemId, historyItemId },
  }: EpiphanyPatchParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingEpiphany = await getCurrentEpiphanyItemForUser({
    suiteId: null,
    storeyId,
    spaceId,
    epiphanyItemId,
    historyItemId,
    userId: user.id,
  })

  if (!existingEpiphany || !existingEpiphany.storey) {
    return NextResponse.json({
      success: false,
      error: 'This is an old epiphany item. You cannot edit it.',
    })
  }

  const epiphanyArgs = (await request.json()) || ''

  if (!epiphanyArgs.name) {
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

  if (!epiphanyArgs.summary) {
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

  if (!epiphanyArgs.content) {
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

  const newEpiphanyItem = await updateEpiphanyItem({
    content: epiphanyArgs.content,
    name: epiphanyArgs.name,
    summary: epiphanyArgs.summary,
    historyItemId,
    suiteId: null,
    storeyId,
    spaceId,
    epiphanyItemId,
    userId: user.id,
  })

  if (!newEpiphanyItem || !newEpiphanyItem.epiphanyItem) {
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
    redirect: `/suite/${existingEpiphany.storey.suite.id}/storey/${storeyId}/space/${spaceId}/dashboard/epiphany/view/${newEpiphanyItem.epiphanyItem.model_id}/${newEpiphanyItem.epiphanyItem.history_id}`,
  })
}

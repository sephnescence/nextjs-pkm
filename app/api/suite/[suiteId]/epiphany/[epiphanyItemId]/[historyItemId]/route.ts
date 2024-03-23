'use server'

import {
  getCurrentEpiphanyItemForUser,
  updateEpiphanyItem,
} from '@/repositories/epiphany'
import { getUserAuth } from '@/utils/auth'
import { NextResponse } from 'next/server'

type EpiphanyGetParams = {
  params: {
    suiteId: string
    historyItemId: string
    epiphanyItemId: string
  }
}

type EpiphanyPatchParams = {
  params: {
    suiteId: string
    epiphanyItemId: string
    historyItemId: string
  }
}

export const GET = async (
  request: Request,
  { params: { suiteId, epiphanyItemId, historyItemId } }: EpiphanyGetParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingEpiphanyHistoryItem = await getCurrentEpiphanyItemForUser(
    suiteId,
    epiphanyItemId,
    historyItemId,
    user.id,
  )

  if (
    !existingEpiphanyHistoryItem ||
    !existingEpiphanyHistoryItem.suite ||
    !existingEpiphanyHistoryItem.epiphany_item
  ) {
    return NextResponse.json({
      success: false,
      redirect: '/',
    })
  }

  return NextResponse.json({
    success: true,
    suite: {
      id: existingEpiphanyHistoryItem.suite.id,
      name: existingEpiphanyHistoryItem.suite.name,
      description: existingEpiphanyHistoryItem.suite.description,
    },
    epiphanyItem: {
      content: existingEpiphanyHistoryItem.epiphany_item.content,
      name: existingEpiphanyHistoryItem.epiphany_item.name,
      summary: existingEpiphanyHistoryItem.epiphany_item.summary,
    },
  })
}

export const PATCH = async (
  request: Request,
  { params: { suiteId, epiphanyItemId, historyItemId } }: EpiphanyPatchParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingEpiphany = await getCurrentEpiphanyItemForUser(
    suiteId,
    epiphanyItemId,
    historyItemId,
    user.id,
  )

  if (!existingEpiphany) {
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
    suiteId,
    epiphanyItemId,
    userId: user.id,
  })

  if (!newEpiphanyItem) {
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
    redirect: `/suite/${suiteId}/epiphany/view/${newEpiphanyItem.epiphanyItem?.model_id}/${newEpiphanyItem.epiphanyItem?.history_id}`,
  })
}

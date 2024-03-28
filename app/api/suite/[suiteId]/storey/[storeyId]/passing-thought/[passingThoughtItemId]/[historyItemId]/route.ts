'use server'

import {
  getCurrentPassingThoughtItemForUser,
  updatePassingThoughtItem,
} from '@/repositories/passingThought'
import { getUserAuth } from '@/utils/auth'
import { NextResponse } from 'next/server'

type PassingThoughtGetParams = {
  params: {
    suiteId: string
    storeyId: string
    historyItemId: string
    passingThoughtItemId: string
  }
}

type PassingThoughtPatchParams = {
  params: {
    suiteId: string
    storeyId: string
    passingThoughtItemId: string
    historyItemId: string
  }
}

export const GET = async (
  request: Request,
  {
    params: { suiteId, storeyId, passingThoughtItemId, historyItemId },
  }: PassingThoughtGetParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingPassingThoughtHistoryItem =
    await getCurrentPassingThoughtItemForUser({
      suiteId,
      storeyId,
      spaceId: null,
      passingThoughtItemId,
      historyItemId,
      userId: user.id,
    })

  if (
    !existingPassingThoughtHistoryItem ||
    !existingPassingThoughtHistoryItem.passing_thought_item
  ) {
    return NextResponse.json({
      success: false,
      redirect: '/',
    })
  }

  return NextResponse.json({
    success: true,
    suite:
      existingPassingThoughtHistoryItem.storey &&
      existingPassingThoughtHistoryItem.storey.suite
        ? {
            id: existingPassingThoughtHistoryItem.storey.suite.id,
            name: existingPassingThoughtHistoryItem.storey.suite.name,
            description:
              existingPassingThoughtHistoryItem.storey.suite.description,
          }
        : null,
    storey: existingPassingThoughtHistoryItem.storey
      ? {
          id: existingPassingThoughtHistoryItem.storey.id,
          name: existingPassingThoughtHistoryItem.storey.name,
          description: existingPassingThoughtHistoryItem.storey.description,
        }
      : null,
    passingThoughtItem: {
      content: existingPassingThoughtHistoryItem.passing_thought_item.content,
      name: existingPassingThoughtHistoryItem.passing_thought_item.name,
      summary: existingPassingThoughtHistoryItem.passing_thought_item.summary,
    },
  })
}

export const PATCH = async (
  request: Request,
  {
    params: { suiteId, storeyId, passingThoughtItemId, historyItemId },
  }: PassingThoughtPatchParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingPassingThought = await getCurrentPassingThoughtItemForUser({
    suiteId,
    storeyId,
    spaceId: null,
    passingThoughtItemId,
    historyItemId,
    userId: user.id,
  })

  if (!existingPassingThought || !existingPassingThought.storey) {
    return NextResponse.json({
      success: false,
      error: 'This is an old passing thought item. You cannot edit it.',
    })
  }

  const passingThoughtArgs = (await request.json()) || ''

  if (!passingThoughtArgs.name) {
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

  if (!passingThoughtArgs.summary) {
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

  if (!passingThoughtArgs.content) {
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

  const newPassingThoughtItem = await updatePassingThoughtItem({
    content: passingThoughtArgs.content,
    name: passingThoughtArgs.name,
    summary: passingThoughtArgs.summary,
    historyItemId,
    suiteId,
    storeyId,
    spaceId: null,
    passingThoughtItemId,
    userId: user.id,
  })

  if (!newPassingThoughtItem || !newPassingThoughtItem.passingThoughtItem) {
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
    redirect: `/suite/${existingPassingThought.storey.suite.id}/storey/${storeyId}/dashboard/passing-thought/view/${newPassingThoughtItem.passingThoughtItem.model_id}/${newPassingThoughtItem.passingThoughtItem.history_id}`,
  })
}

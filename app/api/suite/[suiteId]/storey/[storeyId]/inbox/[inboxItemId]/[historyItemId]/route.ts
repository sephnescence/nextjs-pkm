'use server'

import {
  getCurrentInboxItemForUser,
  updateInboxItem,
} from '@/repositories/inbox'
import { getUserAuth } from '@/utils/auth'
import { NextResponse } from 'next/server'

type InboxGetParams = {
  params: {
    suiteId: string
    storeyId: string
    historyItemId: string
    inboxItemId: string
  }
}

type InboxPatchParams = {
  params: {
    suiteId: string
    storeyId: string
    inboxItemId: string
    historyItemId: string
  }
}

export const GET = async (
  request: Request,
  { params: { suiteId, storeyId, inboxItemId, historyItemId } }: InboxGetParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingInboxHistoryItem = await getCurrentInboxItemForUser({
    suiteId,
    storeyId,
    spaceId: null,
    inboxItemId,
    historyItemId,
    userId: user.id,
  })

  if (!existingInboxHistoryItem || !existingInboxHistoryItem.inbox_item) {
    return NextResponse.json({
      success: false,
      redirect: '/',
    })
  }

  return NextResponse.json({
    success: true,
    suite:
      existingInboxHistoryItem.storey && existingInboxHistoryItem.storey.suite
        ? {
            id: existingInboxHistoryItem.storey.suite.id,
            name: existingInboxHistoryItem.storey.suite.name,
            description: existingInboxHistoryItem.storey.suite.description,
          }
        : null,
    storey: existingInboxHistoryItem.storey
      ? {
          id: existingInboxHistoryItem.storey.id,
          name: existingInboxHistoryItem.storey.name,
          description: existingInboxHistoryItem.storey.description,
        }
      : null,
    inboxItem: {
      content: existingInboxHistoryItem.inbox_item.content,
      name: existingInboxHistoryItem.inbox_item.name,
      summary: existingInboxHistoryItem.inbox_item.summary,
    },
  })
}

export const PATCH = async (
  request: Request,
  {
    params: { suiteId, storeyId, inboxItemId, historyItemId },
  }: InboxPatchParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingInbox = await getCurrentInboxItemForUser({
    suiteId,
    storeyId,
    spaceId: null,
    inboxItemId,
    historyItemId,
    userId: user.id,
  })

  if (!existingInbox || !existingInbox.storey) {
    return NextResponse.json({
      success: false,
      error: 'This is an old inbox item. You cannot edit it.',
    })
  }

  const inboxArgs = (await request.json()) || ''

  if (!inboxArgs.name) {
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

  if (!inboxArgs.summary) {
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

  if (!inboxArgs.content) {
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

  const newInboxItem = await updateInboxItem({
    content: inboxArgs.content,
    name: inboxArgs.name,
    summary: inboxArgs.summary,
    historyItemId,
    suiteId,
    storeyId,
    spaceId: null,
    inboxItemId,
    userId: user.id,
  })

  if (!newInboxItem || !newInboxItem.inboxItem) {
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
    redirect: `/suite/${existingInbox.storey.suite.id}/storey/${storeyId}/dashboard/inbox/view/${newInboxItem.inboxItem.model_id}/${newInboxItem.inboxItem.history_id}`,
  })
}

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
    historyItemId: string
    inboxItemId: string
  }
}

type InboxPatchParams = {
  params: {
    suiteId: string
    inboxItemId: string
    historyItemId: string
  }
}

export const GET = async (
  request: Request,
  { params: { suiteId, inboxItemId, historyItemId } }: InboxGetParams,
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
    storeyId: null,
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
    suite: existingInboxHistoryItem.suite
      ? {
          id: existingInboxHistoryItem.suite.id,
          name: existingInboxHistoryItem.suite.name,
          description: existingInboxHistoryItem.suite.description,
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
  { params: { suiteId, inboxItemId, historyItemId } }: InboxPatchParams,
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
    storeyId: null,
    spaceId: null,
    inboxItemId,
    historyItemId,
    userId: user.id,
  })

  if (!existingInbox || !existingInbox.suite) {
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
    storeyId: null,
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
    redirect: `/suite/${existingInbox.suite.id}/dashboard/inbox/view/${newInboxItem.inboxItem.model_id}/${newInboxItem.inboxItem.history_id}`,
  })
}

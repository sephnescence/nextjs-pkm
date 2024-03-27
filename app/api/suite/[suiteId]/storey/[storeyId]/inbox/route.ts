'use server'

import { storeInboxItem } from '@/repositories/inbox'
import { getStoreyForUser } from '@/repositories/storey'
import { getUserAuth } from '@/utils/auth'
import { NextResponse } from 'next/server'

type StoreyInboxCreateArgs = {
  params: {
    suiteId: string
    storeyId: string
  }
}

export const POST = async (
  request: Request,
  { params: { suiteId, storeyId } }: StoreyInboxCreateArgs,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingStorey = await getStoreyForUser(suiteId, storeyId, user.id)

  if (!existingStorey) {
    return NextResponse.json({
      success: false,
      redirect: '/',
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

  const newInboxItem = await storeInboxItem({
    userId: user.id,
    content: inboxArgs.content,
    name: inboxArgs.name,
    summary: inboxArgs.summary,
    storeyId,
    spaceId: null,
    suiteId,
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
    redirect: `/suite/${existingStorey.suite.id}/storey/${storeyId}/inbox/view/${newInboxItem.inboxItem.model_id}/${newInboxItem.inboxItem.history_id}`,
  })
}

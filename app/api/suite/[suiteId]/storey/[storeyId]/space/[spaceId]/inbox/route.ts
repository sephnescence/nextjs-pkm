'use server'

import { storeInboxItem } from '@/repositories/inbox'
import { getSpaceForUser } from '@/repositories/space'
import { getUserAuth } from '@/utils/auth'
import { NextResponse } from 'next/server'

type SpaceInboxCreateArgs = {
  params: {
    storeyId: string
    spaceId: string
  }
}

export const POST = async (
  request: Request,
  { params: { storeyId, spaceId } }: SpaceInboxCreateArgs,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingSpace = await getSpaceForUser(storeyId, spaceId, user.id)

  if (!existingSpace) {
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
    spaceId,
    suiteId: null,
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
    redirect: `/suite/${existingSpace.storey.suite.id}/storey/${storeyId}/space/${spaceId}/dashboard/inbox/view/${newInboxItem.inboxItem.model_id}/${newInboxItem.inboxItem.history_id}`,
  })
}

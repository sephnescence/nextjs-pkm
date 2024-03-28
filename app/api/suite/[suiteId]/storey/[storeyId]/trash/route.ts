'use server'

import { storeTrashItem } from '@/repositories/trash'
import { getStoreyForUser } from '@/repositories/storey'
import { getUserAuth } from '@/utils/auth'
import { NextResponse } from 'next/server'

type StoreyTrashCreateArgs = {
  params: {
    suiteId: string
    storeyId: string
  }
}

export const POST = async (
  request: Request,
  { params: { suiteId, storeyId } }: StoreyTrashCreateArgs,
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

  const trashArgs = (await request.json()) || ''

  if (!trashArgs.name) {
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

  if (!trashArgs.summary) {
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

  if (!trashArgs.content) {
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

  const newTrashItem = await storeTrashItem({
    userId: user.id,
    content: trashArgs.content,
    name: trashArgs.name,
    summary: trashArgs.summary,
    storeyId,
    spaceId: null,
    suiteId,
  })

  if (!newTrashItem || !newTrashItem.trashItem) {
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
    redirect: `/suite/${existingStorey.suite.id}/storey/${storeyId}/dashboard/trash/view/${newTrashItem.trashItem.model_id}/${newTrashItem.trashItem.history_id}`,
  })
}

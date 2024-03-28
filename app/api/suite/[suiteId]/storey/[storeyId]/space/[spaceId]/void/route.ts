'use server'

import { storeVoidItem } from '@/repositories/void'
import { getSpaceForUser } from '@/repositories/space'
import { getUserAuth } from '@/utils/auth'
import { NextResponse } from 'next/server'

type SpaceVoidCreateArgs = {
  params: {
    storeyId: string
    spaceId: string
  }
}

export const POST = async (
  request: Request,
  { params: { storeyId, spaceId } }: SpaceVoidCreateArgs,
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

  const newVoidItem = await storeVoidItem({
    userId: user.id,
    content: voidArgs.content,
    name: voidArgs.name,
    summary: voidArgs.summary,
    storeyId,
    spaceId,
    suiteId: null,
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
    redirect: `/suite/${existingSpace.storey.suite.id}/storey/${storeyId}/space/${spaceId}/dashboard/void/view/${newVoidItem.voidItem.model_id}/${newVoidItem.voidItem.history_id}`,
  })
}

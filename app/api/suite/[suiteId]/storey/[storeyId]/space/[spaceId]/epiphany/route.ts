'use server'

import { storeEpiphanyItem } from '@/repositories/epiphany'
import { getSpaceForUser } from '@/repositories/space'
import { getUserAuth } from '@/utils/auth'
import { NextResponse } from 'next/server'

type SpaceEpiphanyCreateArgs = {
  params: {
    storeyId: string
    spaceId: string
  }
}

export const POST = async (
  request: Request,
  { params: { storeyId, spaceId } }: SpaceEpiphanyCreateArgs,
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

  const newEpiphanyItem = await storeEpiphanyItem({
    userId: user.id,
    content: epiphanyArgs.content,
    name: epiphanyArgs.name,
    summary: epiphanyArgs.summary,
    storeyId,
    spaceId,
    suiteId: null,
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
    redirect: `/suite/${existingSpace.storey.suite.id}/storey/${storeyId}/space/${spaceId}/dashboard/epiphany/view/${newEpiphanyItem.epiphanyItem.model_id}/${newEpiphanyItem.epiphanyItem.history_id}`,
  })
}

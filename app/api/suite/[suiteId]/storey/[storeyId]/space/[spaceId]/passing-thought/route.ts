'use server'

import { storePassingThoughtItem } from '@/repositories/passingThought'
import { getSpaceForUser } from '@/repositories/space'
import { getUserAuth } from '@/utils/auth'
import { NextResponse } from 'next/server'

type SpacePassingThoughtCreateArgs = {
  params: {
    storeyId: string
    spaceId: string
  }
}

export const POST = async (
  request: Request,
  { params: { storeyId, spaceId } }: SpacePassingThoughtCreateArgs,
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

  const newPassingThoughtItem = await storePassingThoughtItem({
    userId: user.id,
    content: passingThoughtArgs.content,
    name: passingThoughtArgs.name,
    summary: passingThoughtArgs.summary,
    storeyId,
    spaceId,
    suiteId: null,
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
    redirect: `/suite/${existingSpace.storey.suite.id}/storey/${storeyId}/space/${spaceId}/dashboard/passing-thought/view/${newPassingThoughtItem.passingThoughtItem.model_id}/${newPassingThoughtItem.passingThoughtItem.history_id}`,
  })
}

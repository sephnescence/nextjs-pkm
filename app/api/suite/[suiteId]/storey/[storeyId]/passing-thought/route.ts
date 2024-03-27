'use server'

import { storePassingThoughtItem } from '@/repositories/passingThought'
import { getStoreyForUser } from '@/repositories/storey'
import { getUserAuth } from '@/utils/auth'
import { NextResponse } from 'next/server'

type StoreyPassingThoughtCreateArgs = {
  params: {
    suiteId: string
    storeyId: string
  }
}

export const POST = async (
  request: Request,
  { params: { suiteId, storeyId } }: StoreyPassingThoughtCreateArgs,
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
    spaceId: null,
    suiteId,
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
    redirect: `/suite/${existingStorey.suite.id}/storey/${storeyId}/passing-thought/view/${newPassingThoughtItem.passingThoughtItem.model_id}/${newPassingThoughtItem.passingThoughtItem.history_id}`,
  })
}

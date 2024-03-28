'use server'

import { storeEpiphanyItem } from '@/repositories/epiphany'
import { getStoreyForUser } from '@/repositories/storey'
import { getUserAuth } from '@/utils/auth'
import { NextResponse } from 'next/server'

type StoreyEpiphanyCreateArgs = {
  params: {
    suiteId: string
    storeyId: string
  }
}

export const POST = async (
  request: Request,
  { params: { suiteId, storeyId } }: StoreyEpiphanyCreateArgs,
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
    spaceId: null,
    suiteId,
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
    redirect: `/suite/${existingStorey.suite.id}/storey/${storeyId}/dashboard/epiphany/view/${newEpiphanyItem.epiphanyItem.model_id}/${newEpiphanyItem.epiphanyItem.history_id}`,
  })
}

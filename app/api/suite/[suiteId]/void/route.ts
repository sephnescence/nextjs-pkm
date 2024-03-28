'use server'

import { storeVoidItem } from '@/repositories/void'
import { getSuiteForUser } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import { NextResponse } from 'next/server'

type StoreyVoidCreateArgs = {
  params: {
    suiteId: string
  }
}

export const POST = async (
  request: Request,
  { params: { suiteId } }: StoreyVoidCreateArgs,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingSuite = await getSuiteForUser(suiteId, user.id)

  if (!existingSuite) {
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
    storeyId: null,
    spaceId: null,
    suiteId,
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
    redirect: `/suite/${existingSuite.id}/dashboard/void/view/${newVoidItem.voidItem.model_id}/${newVoidItem.voidItem.history_id}`,
  })
}

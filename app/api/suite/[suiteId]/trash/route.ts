'use server'

import { storeTrashItem } from '@/repositories/trash'
import { getSuiteForUser } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import { NextResponse } from 'next/server'

type SuiteTrashCreateArgs = {
  params: {
    suiteId: string
  }
}

export const POST = async (
  request: Request,
  { params: { suiteId } }: SuiteTrashCreateArgs,
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
    storeyId: null,
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
    redirect: `/suite/${existingSuite.id}/trash/view/${newTrashItem.trashItem.model_id}/${newTrashItem.trashItem.history_id}`,
  })
}

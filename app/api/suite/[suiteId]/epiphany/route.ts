'use server'

import { storeEpiphanyItem } from '@/repositories/epiphany'
import { getSuiteForUser } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

type SuiteEpiphanyCreateArgs = {
  params: {
    suiteId: string
  }
}

export const POST = async (
  request: Request,
  { params: { suiteId } }: SuiteEpiphanyCreateArgs,
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
    suiteId,
  })

  if (!newEpiphanyItem) {
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
    redirect: `/suite/${suiteId}/epiphany/view/${newEpiphanyItem.epiphanyItem?.model_id}/${newEpiphanyItem.epiphanyItem?.history_id}`,
  })
}

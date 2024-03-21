'use server'

import { storeInboxItem } from '@/repositories/inbox'
import { getSuiteForUser } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

type SuiteInboxCreateArgs = {
  params: {
    suiteId: string
  }
}

export const POST = async (
  request: Request,
  { params: { suiteId } }: SuiteInboxCreateArgs,
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
    suiteId,
  })

  if (!newInboxItem) {
    return NextResponse.json({
      success: false,
      errors: {
        fieldErrors: {
          general: 'An unexpected error occurred. Please try again.',
        },
      },
    })
  }

  revalidatePath('/dashboard')

  return NextResponse.json({
    success: true,
    redirect: `/suite/${suiteId}/inbox/view/${newInboxItem.inboxItem?.model_id}/${newInboxItem.inboxItem?.history_id}`,
  })
}

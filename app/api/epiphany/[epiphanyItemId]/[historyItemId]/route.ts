'use server'

import {
  getCurrentEpiphanyItemForUser,
  updateEpiphanyItem,
} from '@/repositories/epiphany'
import { getUserAuth } from '@/utils/auth'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

type EpiphanyGetParams = {
  params: {
    historyItemId: string
    epiphanyItemId: string
  }
}

type EpiphanyPatchParams = {
  params: {
    epiphanyItemId: string
    historyItemId: string
  }
}

export const GET = async (
  request: Request,
  { params: { epiphanyItemId, historyItemId } }: EpiphanyGetParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingEpiphany = await getCurrentEpiphanyItemForUser(
    epiphanyItemId,
    historyItemId,
    user.id,
  )

  if (!existingEpiphany) {
    return NextResponse.json({
      success: false,
      redirect: '/',
    })
  }

  return NextResponse.json({
    success: true,
    epiphanyItem: {
      content: existingEpiphany.content,
    },
  })
}

export const PATCH = async (
  request: Request,
  { params: { epiphanyItemId, historyItemId } }: EpiphanyPatchParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingEpiphany = await getCurrentEpiphanyItemForUser(
    epiphanyItemId,
    historyItemId,
    user.id,
  )

  if (!existingEpiphany) {
    return NextResponse.json({
      success: false,
      error: 'This is an old epiphany item. You cannot edit it.',
    })
  }

  const epiphanyArgs = (await request.json()) || ''

  if (!epiphanyArgs.content) {
    return NextResponse.json({
      success: false,
      error: 'Content is required',
    })
  }

  const newEpiphanyItem = await updateEpiphanyItem({
    content: epiphanyArgs.content,
    historyItemId,
    epiphanyItemId,
    userId: user.id,
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

  revalidatePath('/dashboard')

  return NextResponse.json({
    success: true,
    redirect: `/dashboard/epiphany/view/${newEpiphanyItem.epiphanyItem?.model_id}/${newEpiphanyItem.epiphanyItem?.history_id}`,
  })
}

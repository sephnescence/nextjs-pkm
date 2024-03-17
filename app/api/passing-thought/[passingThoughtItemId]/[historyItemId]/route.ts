'use server'

import {
  getCurrentPassingThoughtItemForUser,
  updatePassingThoughtItem,
} from '@/repositories/passingThought'
import { getUserAuth } from '@/utils/auth'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

type PassingThoughtGetParams = {
  params: {
    historyItemId: string
    passingThoughtItemId: string
  }
}

type PassingThoughtPatchParams = {
  params: {
    passingThoughtItemId: string
    historyItemId: string
  }
}

export const GET = async (
  request: Request,
  { params: { passingThoughtItemId, historyItemId } }: PassingThoughtGetParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingPassingThought = await getCurrentPassingThoughtItemForUser(
    passingThoughtItemId,
    historyItemId,
    user.id,
  )

  if (!existingPassingThought) {
    return NextResponse.json({
      success: false,
      redirect: '/',
    })
  }

  return NextResponse.json({
    success: true,
    passingThoughtItem: {
      content: existingPassingThought.content,
    },
  })
}

export const PATCH = async (
  request: Request,
  {
    params: { passingThoughtItemId, historyItemId },
  }: PassingThoughtPatchParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingPassingThought = await getCurrentPassingThoughtItemForUser(
    passingThoughtItemId,
    historyItemId,
    user.id,
  )

  if (!existingPassingThought) {
    return NextResponse.json({
      success: false,
      error: 'This is an old passing thought item. You cannot edit it.',
    })
  }

  const passingThoughtArgs = (await request.json()) || ''

  if (!passingThoughtArgs.content) {
    return NextResponse.json({
      success: false,
      error: 'Content is required',
    })
  }

  const newPassingThoughtItem = await updatePassingThoughtItem({
    content: passingThoughtArgs.content,
    historyItemId,
    passingThoughtItemId,
    userId: user.id,
  })

  if (!newPassingThoughtItem) {
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
    redirect: `/dashboard/passing-thought/view/${newPassingThoughtItem.passingThoughtItem?.model_id}/${newPassingThoughtItem.passingThoughtItem?.history_id}`,
  })
}
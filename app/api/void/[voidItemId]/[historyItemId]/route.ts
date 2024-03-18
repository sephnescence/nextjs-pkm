'use server'

import { getCurrentVoidItemForUser, updateVoidItem } from '@/repositories/void'
import { getUserAuth } from '@/utils/auth'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

type VoidGetParams = {
  params: {
    historyItemId: string
    voidItemId: string
  }
}

type VoidPatchParams = {
  params: {
    voidItemId: string
    historyItemId: string
  }
}

export const GET = async (
  request: Request,
  { params: { voidItemId, historyItemId } }: VoidGetParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingVoid = await getCurrentVoidItemForUser(
    voidItemId,
    historyItemId,
    user.id,
  )

  if (!existingVoid) {
    return NextResponse.json({
      success: false,
      redirect: '/',
    })
  }

  return NextResponse.json({
    success: true,
    voidItem: {
      content: existingVoid.content,
      name: existingVoid.name,
      summary: existingVoid.summary,
    },
  })
}

export const PATCH = async (
  request: Request,
  { params: { voidItemId, historyItemId } }: VoidPatchParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingVoid = await getCurrentVoidItemForUser(
    voidItemId,
    historyItemId,
    user.id,
  )

  if (!existingVoid) {
    return NextResponse.json({
      success: false,
      error: 'This is an old void item. You cannot edit it.',
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

  const newVoidItem = await updateVoidItem({
    content: voidArgs.content,
    name: voidArgs.name,
    summary: voidArgs.summary,
    historyItemId,
    voidItemId,
    userId: user.id,
  })

  if (!newVoidItem) {
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
    redirect: `/dashboard/void/view/${newVoidItem.voidItem?.model_id}/${newVoidItem.voidItem?.history_id}`,
  })
}

'use server'

import { storeVoidItem } from '@/repositories/void'
import { getUserAuth } from '@/utils/auth'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export const POST = async (request: Request) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const voidArgs = (await request.json()) || ''

  if (!voidArgs.content) {
    return NextResponse.json({
      success: false,
      error: 'Content is required',
    })
  }

  const newVoidItem = await storeVoidItem({
    userId: user.id,
    content: voidArgs.content,
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

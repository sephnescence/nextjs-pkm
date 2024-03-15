'use server'

import { storePassingThoughtItem } from '@/repositories/passingThought'
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

  const passingThoughtArgs = (await request.json()) || ''

  if (!passingThoughtArgs.content) {
    return NextResponse.json({
      success: false,
      error: 'Content is required',
    })
  }

  const newPassingThoughtItem = await storePassingThoughtItem({
    userId: user.id,
    content: passingThoughtArgs.content,
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

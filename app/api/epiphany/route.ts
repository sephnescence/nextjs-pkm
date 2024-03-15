'use server'

import { storeEpiphanyItem } from '@/repositories/epiphany'
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

  const epiphanyArgs = (await request.json()) || ''

  if (!epiphanyArgs.content) {
    return NextResponse.json({
      success: false,
      error: 'Content is required',
    })
  }

  const newEpiphanyItem = await storeEpiphanyItem({
    userId: user.id,
    content: epiphanyArgs.content,
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

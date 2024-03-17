'use server'

import { storeTodoItem } from '@/repositories/todo'
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

  const todoArgs = (await request.json()) || ''

  if (!todoArgs.content) {
    return NextResponse.json({
      success: false,
      error: 'Content is required',
    })
  }

  const newTodoItem = await storeTodoItem({
    userId: user.id,
    content: todoArgs.content,
  })

  if (!newTodoItem) {
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
    redirect: `/dashboard/todo/view/${newTodoItem.todoItem?.model_id}/${newTodoItem.todoItem?.history_id}`,
  })
}
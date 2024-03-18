'use server'

import { getCurrentTodoItemForUser, updateTodoItem } from '@/repositories/todo'
import { getUserAuth } from '@/utils/auth'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

type TodoGetParams = {
  params: {
    historyItemId: string
    todoItemId: string
  }
}

type TodoPatchParams = {
  params: {
    todoItemId: string
    historyItemId: string
  }
}

export const GET = async (
  request: Request,
  { params: { todoItemId, historyItemId } }: TodoGetParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingTodo = await getCurrentTodoItemForUser(
    todoItemId,
    historyItemId,
    user.id,
  )

  if (!existingTodo) {
    return NextResponse.json({
      success: false,
      redirect: '/',
    })
  }

  return NextResponse.json({
    success: true,
    todoItem: {
      content: existingTodo.content,
    },
  })
}

export const PATCH = async (
  request: Request,
  { params: { todoItemId, historyItemId } }: TodoPatchParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingTodo = await getCurrentTodoItemForUser(
    todoItemId,
    historyItemId,
    user.id,
  )

  if (!existingTodo) {
    return NextResponse.json({
      success: false,
      error: 'This is an old todo item. You cannot edit it.',
    })
  }

  const todoArgs = (await request.json()) || ''

  if (!todoArgs.name) {
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

  if (!todoArgs.summary) {
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

  if (!todoArgs.content) {
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

  const newTodoItem = await updateTodoItem({
    content: todoArgs.content,
    name: todoArgs.name,
    summary: todoArgs.summary,
    historyItemId,
    todoItemId,
    userId: user.id,
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

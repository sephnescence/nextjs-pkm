'use server'

import { getCurrentTodoItemForUser, updateTodoItem } from '@/repositories/todo'
import { getUserAuth } from '@/utils/auth'
import { NextResponse } from 'next/server'

type TodoGetParams = {
  params: {
    suiteId: string
    historyItemId: string
    todoItemId: string
  }
}

type TodoPatchParams = {
  params: {
    suiteId: string
    todoItemId: string
    historyItemId: string
  }
}

export const GET = async (
  request: Request,
  { params: { suiteId, todoItemId, historyItemId } }: TodoGetParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingTodoHistoryItem = await getCurrentTodoItemForUser(
    suiteId,
    todoItemId,
    historyItemId,
    user.id,
  )

  if (
    !existingTodoHistoryItem ||
    !existingTodoHistoryItem.suite ||
    !existingTodoHistoryItem.todo_item
  ) {
    return NextResponse.json({
      success: false,
      redirect: '/',
    })
  }

  return NextResponse.json({
    success: true,
    suite: {
      id: existingTodoHistoryItem.suite.id,
      name: existingTodoHistoryItem.suite.name,
      description: existingTodoHistoryItem.suite.description,
    },
    todoItem: {
      content: existingTodoHistoryItem.todo_item.content,
      name: existingTodoHistoryItem.todo_item.name,
      summary: existingTodoHistoryItem.todo_item.summary,
    },
  })
}

export const PATCH = async (
  request: Request,
  { params: { suiteId, todoItemId, historyItemId } }: TodoPatchParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingTodo = await getCurrentTodoItemForUser(
    suiteId,
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
    suiteId,
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

  return NextResponse.json({
    success: true,
    redirect: `/suite/${suiteId}/todo/view/${newTodoItem.todoItem?.model_id}/${newTodoItem.todoItem?.history_id}`,
  })
}

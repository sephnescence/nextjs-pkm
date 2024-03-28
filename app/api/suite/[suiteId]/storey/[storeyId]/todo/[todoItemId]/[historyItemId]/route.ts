'use server'

import { getCurrentTodoItemForUser, updateTodoItem } from '@/repositories/todo'
import { getUserAuth } from '@/utils/auth'
import { NextResponse } from 'next/server'

type TodoGetParams = {
  params: {
    suiteId: string
    storeyId: string
    historyItemId: string
    todoItemId: string
  }
}

type TodoPatchParams = {
  params: {
    suiteId: string
    storeyId: string
    todoItemId: string
    historyItemId: string
  }
}

export const GET = async (
  request: Request,
  { params: { suiteId, storeyId, todoItemId, historyItemId } }: TodoGetParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingTodoHistoryItem = await getCurrentTodoItemForUser({
    suiteId,
    storeyId,
    spaceId: null,
    todoItemId,
    historyItemId,
    userId: user.id,
  })

  if (!existingTodoHistoryItem || !existingTodoHistoryItem.todo_item) {
    return NextResponse.json({
      success: false,
      redirect: '/',
    })
  }

  return NextResponse.json({
    success: true,
    suite:
      existingTodoHistoryItem.storey && existingTodoHistoryItem.storey.suite
        ? {
            id: existingTodoHistoryItem.storey.suite.id,
            name: existingTodoHistoryItem.storey.suite.name,
            description: existingTodoHistoryItem.storey.suite.description,
          }
        : null,
    storey: existingTodoHistoryItem.storey
      ? {
          id: existingTodoHistoryItem.storey.id,
          name: existingTodoHistoryItem.storey.name,
          description: existingTodoHistoryItem.storey.description,
        }
      : null,
    todoItem: {
      content: existingTodoHistoryItem.todo_item.content,
      name: existingTodoHistoryItem.todo_item.name,
      summary: existingTodoHistoryItem.todo_item.summary,
    },
  })
}

export const PATCH = async (
  request: Request,
  { params: { suiteId, storeyId, todoItemId, historyItemId } }: TodoPatchParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingTodo = await getCurrentTodoItemForUser({
    suiteId,
    storeyId,
    spaceId: null,
    todoItemId,
    historyItemId,
    userId: user.id,
  })

  if (!existingTodo || !existingTodo.storey) {
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
    storeyId,
    spaceId: null,
    todoItemId,
    userId: user.id,
  })

  if (!newTodoItem || !newTodoItem.todoItem) {
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
    redirect: `/suite/${existingTodo.storey.suite.id}/storey/${storeyId}/dashboard/todo/view/${newTodoItem.todoItem.model_id}/${newTodoItem.todoItem.history_id}`,
  })
}

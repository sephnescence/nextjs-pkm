'use server'

import { storeTodoItem } from '@/repositories/todo'
import { getStoreyForUser } from '@/repositories/storey'
import { getUserAuth } from '@/utils/auth'
import { NextResponse } from 'next/server'

type StoreyTodoCreateArgs = {
  params: {
    suiteId: string
    storeyId: string
  }
}

export const POST = async (
  request: Request,
  { params: { suiteId, storeyId } }: StoreyTodoCreateArgs,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingStorey = await getStoreyForUser(suiteId, storeyId, user.id)

  if (!existingStorey) {
    return NextResponse.json({
      success: false,
      redirect: '/',
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

  const newTodoItem = await storeTodoItem({
    userId: user.id,
    content: todoArgs.content,
    name: todoArgs.name,
    summary: todoArgs.summary,
    storeyId,
    spaceId: null,
    suiteId,
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
    redirect: `/suite/${existingStorey.suite.id}/storey/${storeyId}/todo/view/${newTodoItem.todoItem.model_id}/${newTodoItem.todoItem.history_id}`,
  })
}

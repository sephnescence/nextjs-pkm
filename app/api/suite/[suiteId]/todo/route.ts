'use server'

import { storeTodoItem } from '@/repositories/todo'
import { getSuiteForUser } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

type SuiteTodoCreateArgs = {
  params: {
    suiteId: string
  }
}

export const POST = async (
  request: Request,
  { params: { suiteId } }: SuiteTodoCreateArgs,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingSuite = await getSuiteForUser(suiteId, user.id)

  if (!existingSuite) {
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
    suiteId,
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

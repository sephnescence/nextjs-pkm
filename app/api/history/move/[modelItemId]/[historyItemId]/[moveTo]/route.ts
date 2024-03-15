'use server'

import { updateEpiphanyItem } from '@/repositories/epiphany'
import { getHistoryItem } from '@/repositories/history'
import { updateInboxItem } from '@/repositories/inbox'
import { updatePassingThoughtItem } from '@/repositories/passingThought'
import { updateTodoItem } from '@/repositories/todo'
import { updateTrashItem } from '@/repositories/trash'
import { updateVoidItem } from '@/repositories/void'
import { getUserAuth } from '@/utils/auth'
import { NextResponse } from 'next/server'

type HistoryMoveParams = {
  params: {
    historyItemId: string
    modelItemId: string
    moveTo: string
  }
}

export const POST = async (
  request: Request,
  { params: { modelItemId, historyItemId, moveTo } }: HistoryMoveParams,
) => {
  if (moveTo === 'epiphany') {
    return await historyActionMoveToEpiphany(modelItemId, historyItemId)
  } else if (moveTo === 'inbox') {
    return await historyActionMoveToInbox(modelItemId, historyItemId)
  } else if (moveTo === 'passing-thought') {
    return await historyActionMoveToPassingThought(modelItemId, historyItemId)
  } else if (moveTo === 'todo') {
    return await historyActionMoveToTodo(modelItemId, historyItemId)
  } else if (moveTo === 'void') {
    return await historyActionMoveToVoid(modelItemId, historyItemId)
  } else if (moveTo === 'trash') {
    return await historyActionMoveToTrash(modelItemId, historyItemId)
  }

  return NextResponse.json({
    success: false,
    redirect: '/',
  })
}

const historyActionMoveToEpiphany = async (
  modelItemId: string,
  historyItemId: string,
) => await _historyActionMove(modelItemId, historyItemId, 'epiphany')
const historyActionMoveToInbox = async (
  modelItemId: string,
  historyItemId: string,
) => await _historyActionMove(modelItemId, historyItemId, 'inbox')
const historyActionMoveToPassingThought = async (
  modelItemId: string,
  historyItemId: string,
) => await _historyActionMove(modelItemId, historyItemId, 'passing-thought')
const historyActionMoveToTodo = async (
  modelItemId: string,
  historyItemId: string,
) => await _historyActionMove(modelItemId, historyItemId, 'todo')
const historyActionMoveToTrash = async (
  modelItemId: string,
  historyItemId: string,
) => await _historyActionMove(modelItemId, historyItemId, 'trash')
const historyActionMoveToVoid = async (
  modelItemId: string,
  historyItemId: string,
) => await _historyActionMove(modelItemId, historyItemId, 'void')

const _historyActionMove = async (
  modelId: string,
  historyId: string,
  moveTo: 'epiphany' | 'inbox' | 'passing-thought' | 'todo' | 'trash' | 'void',
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  try {
    const userId = user.id

    const historyItemResponse = await getHistoryItem(
      modelId!,
      historyId!,
      userId,
    )

    if (
      historyItemResponse.success === false ||
      !historyItemResponse.historyItem
    ) {
      return NextResponse.json({
        errors: {
          fieldErrors: {
            general: 'No history item found',
          },
        },
      })
    }

    const item =
      historyItemResponse.historyItem.inbox_item ||
      historyItemResponse.historyItem.epiphany_item ||
      historyItemResponse.historyItem.passing_thought_item ||
      historyItemResponse.historyItem.todo_item ||
      historyItemResponse.historyItem.void_item ||
      historyItemResponse.historyItem.trash_item

    if (!item) {
      return NextResponse.json({
        errors: {
          fieldErrors: {
            general: 'No item found',
          },
        },
      })
    }

    const content = item?.content

    let redirectUrl

    if (moveTo === 'epiphany') {
      const response = await updateEpiphanyItem({
        content: content!,
        historyItemId: historyId!,
        epiphanyItemId: modelId!,
        userId,
      })

      if (response.success === true && response.epiphanyItem) {
        redirectUrl = `/dashboard/epiphany/view/${response.epiphanyItem.model_id}/${response.epiphanyItem.history_id}`
      }
    } else if (moveTo === 'inbox') {
      const response = await updateInboxItem({
        content: content!,
        historyItemId: historyId!,
        inboxItemId: modelId!,
        userId,
      })

      if (response.success === true && response.inboxItem) {
        redirectUrl = `/dashboard/inbox/view/${response.inboxItem.model_id}/${response.inboxItem.history_id}`
      }
    } else if (moveTo === 'passing-thought') {
      const response = await updatePassingThoughtItem({
        content: content!,
        historyItemId: historyId!,
        passingThoughtItemId: modelId!,
        userId,
      })

      if (response.success === true && response.passingThoughtItem) {
        redirectUrl = `/dashboard/passing-thought/view/${response.passingThoughtItem.model_id}/${response.passingThoughtItem.history_id}`
      }
    } else if (moveTo === 'todo') {
      const response = await updateTodoItem({
        content: content!,
        historyItemId: historyId!,
        todoItemId: modelId!,
        userId,
      })

      if (response.success === true && response.todoItem) {
        redirectUrl = `/dashboard/todo/view/${response.todoItem.model_id}/${response.todoItem.history_id}`
      }
    } else if (moveTo === 'trash') {
      const response = await updateTrashItem({
        content: content!,
        historyItemId: historyId!,
        trashItemId: modelId!,
        userId,
      })
      if (response.success === true && response.trashItem) {
        redirectUrl = `/dashboard/trash/view/${response.trashItem.model_id}/${response.trashItem.history_id}`
      }
    } else if (moveTo === 'void') {
      const response = await updateVoidItem({
        content: content!,
        historyItemId: historyId!,
        voidItemId: modelId!,
        userId,
      })

      if (response.success === true && response.voidItem) {
        redirectUrl = `/dashboard/void/view/${response.voidItem.model_id}/${response.voidItem.history_id}`
      }
    }

    if (redirectUrl) {
      return NextResponse.json({
        success: true,
        redirect: redirectUrl,
      })
    }

    return NextResponse.json({
      errors: {
        fieldErrors: {
          general: 'Failed to update epiphany item. Please try again.',
        },
      },
    })
  } catch {
    return NextResponse.json({
      errors: {
        fieldErrors: {
          general: 'No form data found',
        },
      },
    })
  }
}

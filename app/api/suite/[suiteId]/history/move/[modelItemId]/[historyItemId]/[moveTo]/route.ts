'use server'

import { updateEpiphanyItem } from '@/repositories/epiphany'
import { getCurrentHistoryItemForUser } from '@/repositories/history'
import { updateInboxItem } from '@/repositories/inbox'
import { updatePassingThoughtItem } from '@/repositories/passingThought'
import { updateTodoItem } from '@/repositories/todo'
import { updateTrashItem } from '@/repositories/trash'
import { updateVoidItem } from '@/repositories/void'
import { getUserAuth } from '@/utils/auth'
import { NextResponse } from 'next/server'

type HistoryMoveParams = {
  params: {
    suiteId: string
    historyItemId: string
    modelItemId: string
    moveTo: string
  }
}

export const POST = async (
  request: Request,
  {
    params: { suiteId, modelItemId, historyItemId, moveTo },
  }: HistoryMoveParams,
) => {
  if (moveTo === 'epiphany') {
    return await historyActionMoveToEpiphany(
      suiteId,
      modelItemId,
      historyItemId,
    )
  } else if (moveTo === 'inbox') {
    return await historyActionMoveToInbox(suiteId, modelItemId, historyItemId)
  } else if (moveTo === 'passing-thought') {
    return await historyActionMoveToPassingThought(
      suiteId,
      modelItemId,
      historyItemId,
    )
  } else if (moveTo === 'todo') {
    return await historyActionMoveToTodo(suiteId, modelItemId, historyItemId)
  } else if (moveTo === 'void') {
    return await historyActionMoveToVoid(suiteId, modelItemId, historyItemId)
  } else if (moveTo === 'trash') {
    return await historyActionMoveToTrash(suiteId, modelItemId, historyItemId)
  }

  return NextResponse.json({
    success: false,
    redirect: '/',
  })
}

const historyActionMoveToEpiphany = async (
  suiteId: string,
  modelItemId: string,
  historyItemId: string,
) => await _historyActionMove(suiteId, modelItemId, historyItemId, 'epiphany')
const historyActionMoveToInbox = async (
  suiteId: string,
  modelItemId: string,
  historyItemId: string,
) => await _historyActionMove(suiteId, modelItemId, historyItemId, 'inbox')
const historyActionMoveToPassingThought = async (
  suiteId: string,
  modelItemId: string,
  historyItemId: string,
) =>
  await _historyActionMove(
    suiteId,
    modelItemId,
    historyItemId,
    'passing-thought',
  )
const historyActionMoveToTodo = async (
  suiteId: string,
  modelItemId: string,
  historyItemId: string,
) => await _historyActionMove(suiteId, modelItemId, historyItemId, 'todo')
const historyActionMoveToTrash = async (
  suiteId: string,
  modelItemId: string,
  historyItemId: string,
) => await _historyActionMove(suiteId, modelItemId, historyItemId, 'trash')
const historyActionMoveToVoid = async (
  suiteId: string,
  modelItemId: string,
  historyItemId: string,
) => await _historyActionMove(suiteId, modelItemId, historyItemId, 'void')

const _historyActionMove = async (
  suiteId: string,
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

    const historyItemResponse = await getCurrentHistoryItemForUser(
      suiteId,
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
    const name = item?.name
    const summary = item?.summary

    let redirectUrl

    if (moveTo === 'epiphany') {
      const response = await updateEpiphanyItem({
        content: content!,
        name: name!,
        summary: summary!,
        historyItemId: historyId!,
        epiphanyItemId: modelId!,
        userId,
        suiteId,
      })

      if (response.success === true && response.epiphanyItem) {
        redirectUrl = `/suite/${suiteId}/epiphany/view/${response.epiphanyItem.model_id}/${response.epiphanyItem.history_id}`
      }
    } else if (moveTo === 'inbox') {
      const response = await updateInboxItem({
        content: content!,
        name: name!,
        summary: summary!,
        historyItemId: historyId!,
        inboxItemId: modelId!,
        userId,
        suiteId,
      })

      if (response.success === true && response.inboxItem) {
        redirectUrl = `/suite/${suiteId}/inbox/view/${response.inboxItem.model_id}/${response.inboxItem.history_id}`
      }
    } else if (moveTo === 'passing-thought') {
      const response = await updatePassingThoughtItem({
        content: content!,
        name: name!,
        summary: summary!,
        historyItemId: historyId!,
        passingThoughtItemId: modelId!,
        userId,
        suiteId,
      })

      if (response.success === true && response.passingThoughtItem) {
        redirectUrl = `/suite/${suiteId}/passing-thought/view/${response.passingThoughtItem.model_id}/${response.passingThoughtItem.history_id}`
      }
    } else if (moveTo === 'todo') {
      const response = await updateTodoItem({
        content: content!,
        name: name!,
        summary: summary!,
        historyItemId: historyId!,
        todoItemId: modelId!,
        userId,
        suiteId,
      })

      if (response.success === true && response.todoItem) {
        redirectUrl = `/suite/${suiteId}/todo/view/${response.todoItem.model_id}/${response.todoItem.history_id}`
      }
    } else if (moveTo === 'trash') {
      const response = await updateTrashItem({
        content: content!,
        name: name!,
        summary: summary!,
        historyItemId: historyId!,
        trashItemId: modelId!,
        userId,
        suiteId,
      })
      if (response.success === true && response.trashItem) {
        redirectUrl = `/suite/${suiteId}/trash/view/${response.trashItem.model_id}/${response.trashItem.history_id}`
      }
    } else if (moveTo === 'void') {
      const response = await updateVoidItem({
        content: content!,
        name: name!,
        summary: summary!,
        historyItemId: historyId!,
        voidItemId: modelId!,
        userId,
        suiteId,
      })

      if (response.success === true && response.voidItem) {
        redirectUrl = `/suite/${suiteId}/void/view/${response.voidItem.model_id}/${response.voidItem.history_id}`
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
          general: 'Failed to move history item. Please try again.',
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
